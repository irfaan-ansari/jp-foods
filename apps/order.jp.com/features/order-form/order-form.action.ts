"use server"

import { db, lineItem, order } from "@jp/db"
import { AppError } from "@jp/utils"

import { orgActionClient } from "@/lib/safe-action"
import { toOrderItemInput } from "./order-form.utils"
import { calculateOrder } from "./order-form.calculate"
import { resolveTeamPrices } from "../team/team.price-resolver"
import { toInsertLineItems, toInsertOrder } from "./order-form.utils"
import { createOrderSchema, updateOrderSchema } from "./order-form.schema"
import { eq, inArray } from "drizzle-orm"
import type { BatchItem } from "drizzle-orm/batch"

export const createOrder = orgActionClient({ order: ["create"] })
  .inputSchema(createOrderSchema)
  .action(async ({ clientInput, ctx }) => {
    const { data } = clientInput
    const { organizationId, teamId, session } = ctx

    const itemsByProductId = new Map(data.items.map((item) => [item.id, item]))

    const [products, team] = await Promise.all([
      db.query.product.findMany({
        where: (p, { inArray, and, eq }) =>
          and(
            eq(p.organizationId, organizationId),
            inArray(p.id, [...itemsByProductId.keys()])
          ),
      }),

      db.query.team.findFirst({
        where: (t, { eq }) => eq(t.id, teamId),
        with: {
          taxRule: true,
        },
      }),
    ])

    const resolvedProducts = await resolveTeamPrices({
      products,
      teamId,
    })

    const orderItems = resolvedProducts.map((product) => ({
      ...toOrderItemInput({ ...product, price: String(product.price) }),
      quantity: itemsByProductId.get(product.id)?.quantity ?? 0,
    }))

    const { items, totals } = calculateOrder({
      items: orderItems,
      taxRate: Number(team?.taxRule?.rate ?? 0),
      charges: 15,
    })

    const insertOrderValues = toInsertOrder({
      data,
      totals,
      taxRule: team?.taxRule,
      organizationId,
      teamId,
      userId: session.userId,
    })

    const [createdOrder] = await db
      .insert(order)
      .values(insertOrderValues)
      .returning({ id: order.id })

    if (!createdOrder) throw new AppError("INTERNAL_SERVER_ERROR")

    const insertLineItemValues = toInsertLineItems({
      items,
      orderId: createdOrder.id,
      organizationId,
      teamId,
      taxRate: team?.taxRule?.rate,
    })
    await db.insert(lineItem).values(insertLineItemValues)

    return {
      success: true,
      id: createdOrder.id,
    }
  })

/**
 * update order
 */
export const updateOrder = orgActionClient({ order: ["update"] })
  .inputSchema(updateOrderSchema)
  .action(async ({ clientInput, ctx }) => {
    const { id, data } = clientInput
    const { teamId, organizationId, session } = ctx

    const itemsByProductId = new Map(data.items.map((item) => [item.id, item]))

    const [existingOrder, products, team] = await Promise.all([
      db.query.order.findFirst({
        where: (o, { and, eq }) =>
          and(
            eq(o.id, id),
            eq(o.teamId, teamId),
            eq(o.organizationId, organizationId)
          ),
        with: {
          lineItems: {
            columns: {
              id: true,
              productId: true,
            },
          },
        },
      }),
      db.query.product.findMany({
        where: (p, { inArray, and, eq }) =>
          and(
            eq(p.organizationId, organizationId),
            inArray(p.id, [...itemsByProductId.keys()])
          ),
      }),
      db.query.team.findFirst({
        where: (t, { eq }) => eq(t.id, teamId),
        with: {
          taxRule: true,
        },
      }),
    ])

    if (!existingOrder) throw new AppError("NOT_FOUND")

    const resolvedProducts = await resolveTeamPrices({
      products,
      teamId,
    })

    const orderItems = resolvedProducts.map((product) => ({
      ...toOrderItemInput({ ...product, price: String(product.price) }),
      quantity: itemsByProductId.get(product.id)?.quantity ?? 0,
    }))

    const { items, totals } = calculateOrder({
      items: orderItems,
      taxRate: Number(team?.taxRule?.rate ?? 0),
      charges: 15,
    })

    const insertOrderValues = toInsertOrder({
      data,
      totals,
      taxRule: team?.taxRule,
      organizationId,
      teamId,
      userId: session.userId,
    })

    // update lineItems
    const existingByProductId = new Map(
      existingOrder.lineItems.map((item) => [item.productId, item])
    )

    const calculatedByProductId = new Map(items.map((item) => [item.id, item]))

    const productIds = new Set(calculatedByProductId.keys())

    const idsToDelete = existingOrder.lineItems
      .filter((item) => !productIds.has(item.productId!))
      .map((item) => item.id)

    const queries: BatchItem<"pg">[] = [
      db.update(order).set(insertOrderValues).where(eq(order.id, id)),
    ]

    for (const [productId, calculated] of calculatedByProductId) {
      const [values] = toInsertLineItems({
        items: [calculated],
        orderId: existingOrder.id,
        organizationId,
        teamId,
        taxRate: team?.taxRule?.rate,
      })

      const existing = existingByProductId.get(productId)

      if (existing) {
        queries.push(
          db.update(lineItem).set(values!).where(eq(lineItem.id, existing.id))
        )
      } else {
        queries.push(db.insert(lineItem).values(values!))
      }
    }

    if (idsToDelete.length > 0) {
      queries.push(db.delete(lineItem).where(inArray(lineItem.id, idsToDelete)))
    }

    await db.batch(queries as [BatchItem<"pg">, ...BatchItem<"pg">[]])

    return { success: true, id: id }
  })
