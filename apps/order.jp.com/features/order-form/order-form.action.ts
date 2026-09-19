"use server"

import { db, lineItem, order } from "@jp/db"
import { AppError } from "@jp/utils"
import { and, eq, inArray } from "drizzle-orm"
import type { BatchItem } from "drizzle-orm/batch"

import { orgActionClient } from "@/lib/safe-action"

import { calculateOrder } from "./order-form.calculate"
import { createOrderSchema, updateOrderSchema } from "./order-form.schema"
import { toInsertLineItems, toInsertOrder } from "./order-form.utils"
import { resolveOrderItems } from "./order-form.resolve"

const lineKey = (productId: number, unitName: string) =>
  `${productId}:${unitName}`

export const createOrder = orgActionClient({ order: ["create"] })
  .inputSchema(createOrderSchema)
  .action(async ({ clientInput, ctx }) => {
    const { data } = clientInput
    const { organizationId, teamId, session } = ctx

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
      charges: 15,
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

    await db.insert(lineItem).values(
      toInsertLineItems({
        items,
        orderId: created.id,
        organizationId,
        teamId,
        taxRate: team?.taxRule?.rate,
      })
    )
    return { success: true, id: created.id }
  })

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
            columns: { id: true, productId: true, unitName: true },
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
      charges: 15,
    })
    const values = toInsertOrder({
      data,
      totals,
      taxRule: team?.taxRule,
      organizationId,
      teamId,
      userId: session.userId,
    })
    const existingByKey = new Map(
      existing.lineItems.map((item) => [
        lineKey(item.productId!, item.unitName!),
        item,
      ])
    )
    const requestedKeys = new Set(
      items.map((item) => lineKey(item.id, item.unitName))
    )
    const toDelete = existing.lineItems
      .filter(
        (item) => !requestedKeys.has(lineKey(item.productId!, item.unitName!))
      )
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
      const previous = existingByKey.get(lineKey(item.id, item.unitName))
      if (previous)
        queries.push(
          db
            .update(lineItem)
            .set(lineValues!)
            .where(eq(lineItem.id, previous.id)) as BatchItem<"pg">
        )
      else
        queries.push(db.insert(lineItem).values(lineValues!) as BatchItem<"pg">)
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
