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

import { calculateOrder } from "./order-form.calculate"
import { createOrderSchema, updateOrderSchema } from "./order-form.schema"
import { toInsertLineItems, toInsertOrder } from "./order-form.utils"
import { resolveOrderItems } from "./order-form.resolve"

const toOrderEmailItems = (items: ReturnType<typeof calculateOrder>["items"]) =>
  items.map((item) => ({
    id: item.id,
    title: item.title,
    itemCode: item.itemCode,
    quantity: item.quantity,
    unitLabel: item.unitLabel,
    subtotal: item.subtotal.toFixed(2),
  }))

const isString = (value: string | undefined): value is string => !!value

/**
 * create order
 */
export const createOrder = orgActionClient({ order: ["create"] })
  .inputSchema(createOrderSchema)
  .action(async ({ clientInput, ctx }) => {
    const { data } = clientInput
    const { organizationId, teamId, session, user } = ctx

    const [orderItems, team] = await Promise.all([
      resolveOrderItems(data.items, organizationId, teamId),
      db.query.team.findFirst({
        where: (team) => eq(team.id, teamId),
        with: { taxRule: true },
      }),
    ])

    const { items, totals } = calculateOrder({
      items: orderItems,
      taxRate: Number(team?.taxRule?.rate ?? 0),
    })

    const values = toInsertOrder({
      data,
      totals,
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
      charges: { type: "Fuel Charge", amount: "15" },
      total: totals.total.toFixed(2),
    }

    const emailResults = await Promise.allSettled([
      sendEmail({
        to: Array.from(new Set([user.email, team?.email].filter(isString))),
        subject: `Jimenez Produce - Order #${created.id} Received`,
        template: OrderConfirmationEmail(emailPayload),
      }),
      sendEmail({
        subject: `New order #${created.id}`,
        template: OrderAdminEmail(emailPayload),
      }),
    ])

    const failedEmails = emailResults.filter(
      (result) => result.status === "rejected"
    )

    if (failedEmails.length) {
      console.error("order.email.failed:", {
        orderId: created.id,
        failures: failedEmails.map((result) => result.reason),
      })
    }

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

    const { items, totals } = calculateOrder({
      items: orderItems,
      taxRate: Number(team?.taxRule?.rate ?? 0),
    })
    const values = toInsertOrder({
      data,
      totals,
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
