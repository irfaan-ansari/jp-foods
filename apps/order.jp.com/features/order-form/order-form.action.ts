"use server"

import { db, lineItem, order } from "@jp/db"
import { AppError } from "@jp/utils"
import { and, eq, inArray } from "drizzle-orm"
import type { BatchItem } from "drizzle-orm/batch"

import { orgActionClient } from "@/lib/safe-action"
import { sendEmail } from "@jp/notifications"
import {
  OrderAdminEmail,
  OrderConfirmationEmail,
} from "@jp/notifications/templates"

import { calculateOrder, DEFAULT_CHARGE } from "@jp/utils/commerce"
import type { OrderItem } from "./order-form.type"
import { createOrderSchema, updateOrderSchema } from "./order-form.schema"
import { toInsertLineItems, toInsertOrder } from "./order-form.utils"
import { resolveOrderItems } from "./order-form.resolve"
import { waitUntil } from "@vercel/functions"

const toOrderEmailItems = (items: OrderItem[]) =>
  items.map((item) => ({
    id: item.id,
    title: item.title,
    itemCode: item.itemCode,
    quantity: item.quantity,
    unitLabel: item.displayLabel,
    subtotal: item.subtotal.toFixed(2),
  }))

const isString = (value: string | undefined): value is string => !!value

/**
 * create order
 */
export const createOrder = orgActionClient({ order: ["create"] })
  .inputSchema(createOrderSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { data } = parsedInput
    const { organizationId, teamId, session, user } = ctx

    const [orderItems, team, org] = await Promise.all([
      resolveOrderItems(data.items, organizationId, teamId),
      db.query.team.findFirst({
        where: (team) => eq(team.id, teamId),
        with: { taxRule: true },
      }),
      db.query.organization.findFirst({
        where: (o, { eq }) => eq(o.id, organizationId),
        columns: { email: true },
      }),
    ])

    const charges = { ...DEFAULT_CHARGE }
    const { items, totals } = calculateOrder({
      items: orderItems,
      charges: charges.amount,
      taxRate: Number(team?.taxRule?.rate ?? 0),
    })

    const values = toInsertOrder({
      data,
      totals,
      charges,
      taxRule: team?.taxRule,
      organizationId,
      teamId,
      userId: session.userId,
    })

    const [created] = await db
      .insert(order)
      .values(values)
      .returning({ id: order.id })

    if (!created) throw new AppError("INTERNAL_SERVER_ERROR")

    const createOrderItems = toInsertLineItems({
      items,
      orderId: created.id,
      organizationId,
      teamId,
      taxRate: team?.taxRule?.rate,
    })

    try {
      await db.insert(lineItem).values(createOrderItems)
    } catch (error) {
      try {
        await db.delete(order).where(eq(order.id, created.id))
      } catch (cleanupError) {
        console.error("order.cleanup.failed:", {
          orderId: created.id,
          cleanupError,
        })
      }

      throw error
    }

    const emailPayload = {
      name: user.name,
      orderId: created.id,
      company: team?.name ?? "",
      items: toOrderEmailItems(items),
      subtotal: totals.subtotal.toFixed(2),
      taxAmount: totals.taxAmount.toFixed(2),
      charges: values.charges,
      total: totals.total.toFixed(2),
    }

    waitUntil(
      Promise.all([
        sendEmail({
          to: Array.from(new Set([user.email, team?.email].filter(isString))),
          subject: `Jimenez Produce - Order #${created.id} Received`,
          template: OrderConfirmationEmail(emailPayload),
        }),
        sendEmail({
          to: org?.email,
          subject: `New order #${created.id}`,
          template: OrderAdminEmail(emailPayload),
        }),
      ])
    )

    return { success: true, id: created.id }
  })

/**
 * update order
 */
export const updateOrder = orgActionClient({ order: ["update"] })
  .inputSchema(updateOrderSchema)
  .action(async ({ clientInput, ctx }) => {
    const { id, data } = clientInput
    const { organizationId, teamId, session } = ctx

    const [existing, orderItems, team] = await Promise.all([
      db.query.order.findFirst({
        where: (order) =>
          and(
            eq(order.id, id),
            eq(order.organizationId, organizationId),
            eq(order.teamId, teamId)
          ),
        with: {
          lineItems: {
            columns: { id: true },
          },
        },
      }),
      resolveOrderItems(data.items, organizationId, teamId),
      db.query.team.findFirst({
        where: (team) => eq(team.id, teamId),
        with: { taxRule: true },
      }),
    ])

    if (!existing) throw new AppError("NOT_FOUND")
    if (existing.status !== "in_progress") throw new AppError("INVALID_REQUEST")

    const charges = {
      type: existing.charges?.type ?? DEFAULT_CHARGE.type,
      amount: Number(existing.charges?.amount ?? DEFAULT_CHARGE.amount),
    }
    const { items, totals } = calculateOrder({
      items: orderItems,
      charges: charges.amount,
      taxRate: Number(team?.taxRule?.rate ?? 0),
    })
    const values = toInsertOrder({
      data,
      totals,
      charges,
      taxRule: team?.taxRule,
      organizationId,
      teamId,
      userId: session.userId,
    })

    const existingLineItemIds = new Set(
      existing.lineItems.map((item) => item.id)
    )
    const requestedExistingLineItemIds = items.flatMap((item) =>
      item.lineItemId === undefined ? [] : [item.lineItemId]
    )
    const requestedLineItemIds = new Set(requestedExistingLineItemIds)

    if (requestedLineItemIds.size !== requestedExistingLineItemIds.length)
      throw new AppError("INVALID_REQUEST")

    const toDelete = existing.lineItems
      .filter((item) => !requestedLineItemIds.has(item.id))
      .map((item) => item.id)
    const queries: BatchItem<"pg">[] = [
      db.update(order).set(values).where(eq(order.id, id)),
    ]

    for (const item of items) {
      const [lineValues] = toInsertLineItems({
        items: [item],
        orderId: id,
        organizationId,
        teamId,
        taxRate: team?.taxRule?.rate,
      })

      if (item.lineItemId) {
        if (!existingLineItemIds.has(item.lineItemId))
          throw new AppError("INVALID_REQUEST")

        queries.push(
          db
            .update(lineItem)
            .set(lineValues!)
            .where(eq(lineItem.id, item.lineItemId)) as BatchItem<"pg">
        )
      } else {
        queries.push(db.insert(lineItem).values(lineValues!) as BatchItem<"pg">)
      }
    }
    if (toDelete.length)
      queries.push(
        db
          .delete(lineItem)
          .where(inArray(lineItem.id, toDelete)) as BatchItem<"pg">
      )
    await db.batch(queries as [BatchItem<"pg">, ...BatchItem<"pg">[]])
    return { success: true, id }
  })
