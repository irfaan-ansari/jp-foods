"use server"

import { db, lineItem, order } from "@jp/db"
import { AppError } from "@jp/utils"
import { and, eq, inArray } from "drizzle-orm"
import type { BatchItem } from "drizzle-orm/batch"

import { orgActionClient } from "@/lib/safe-action"
import { getTeamPriceResolver } from "../team/team.price-resolver"
import { calculateOrder } from "./order-form.calculate"
import { createOrderSchema, updateOrderSchema } from "./order-form.schema"
import {
  toInsertLineItems,
  toInsertOrder,
  toOrderItemInput,
} from "./order-form.utils"

type RequestedItem = { id: number; sellUnitId: number; quantity: number }

const lineKey = (productId: number, sellUnitId: number) =>
  `${productId}:${sellUnitId}`

async function resolveOrderItems(
  requestedItems: RequestedItem[],
  organizationId: string,
  teamId: string
) {
  const ids = [...new Set(requestedItems.map((item) => item.id))]
  const [products, privateProducts] = await Promise.all([
    db.query.product.findMany({
      where: (product) =>
        and(
          eq(product.organizationId, organizationId),
          inArray(product.id, ids)
        ),
      with: { sellUnits: true },
    }),
    db.query.teamProduct.findMany({
      where: (teamProduct) => eq(teamProduct.teamId, teamId),
      columns: { productId: true },
    }),
  ])
  const privateIds = new Set(privateProducts.map((item) => item.productId))
  const byId = new Map(products.map((product) => [product.id, product]))
  const resolvePrice = await getTeamPriceResolver(teamId)
  const seen = new Set<string>()
  const inventoryByProduct = new Map<number, number>()

  const items = requestedItems.map((request) => {
    const key = lineKey(request.id, request.sellUnitId)
    if (seen.has(key))
      throw new AppError("INVALID_REQUEST", {
        message: "The same product and sell unit was added twice.",
      })
    seen.add(key)

    const product = byId.get(request.id)
    if (
      !product ||
      product.status === "archived" ||
      (product.status !== "active" && !privateIds.has(product.id))
    )
      throw new AppError("INVALID_REQUEST", {
        message: "A selected product is no longer available to this team.",
      })

    const pricedProduct = resolvePrice(product)

    const unit = pricedProduct.sellUnits.find(
      (sellUnit) => sellUnit.id === request.sellUnitId
    )
    if (!unit)
      throw new AppError("INVALID_REQUEST", {
        message: "A selected sell unit is no longer available.",
      })

    const minimum = Number(unit.minQuantity)
    const increment = Number(unit.orderIncreament)
    const conversion = Number(unit.inventoryPerUnit)
    const price = Number(unit.price)
    if (
      !Number.isFinite(minimum) ||
      minimum <= 0 ||
      !Number.isFinite(increment) ||
      increment <= 0 ||
      !Number.isFinite(conversion) ||
      conversion <= 0 ||
      !Number.isFinite(price) ||
      price < 0 ||
      request.quantity < minimum ||
      Math.abs(
        (request.quantity - minimum) / increment -
          Math.round((request.quantity - minimum) / increment)
      ) > 1e-8
    )
      throw new AppError("INVALID_REQUEST", {
        message: `Quantity for ${product.title} must meet the ${unit.name} minimum and increment.`,
      })

    inventoryByProduct.set(
      request.id,
      (inventoryByProduct.get(request.id) ?? 0) + request.quantity * conversion
    )
    return {
      ...toOrderItemInput(pricedProduct, unit),
      quantity: request.quantity,
    }
  })

  for (const product of products) {
    if (product.trackInventory && !product.allowBackorder) {
      const stock = Number(product.stock)
      if (
        !Number.isFinite(stock) ||
        (inventoryByProduct.get(product.id) ?? 0) > stock
      ) {
        throw new AppError("INVALID_REQUEST", {
          message: `${product.title} does not have enough stock for the selected sell units.`,
        })
      }
    }
  }

  return items
}

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
            columns: { id: true, productId: true, sellUnitId: true },
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
        lineKey(item.productId!, item.sellUnitId!),
        item,
      ])
    )
    const requestedKeys = new Set(
      items.map((item) => lineKey(item.id, item.sellUnitId))
    )
    const toDelete = existing.lineItems
      .filter(
        (item) => !requestedKeys.has(lineKey(item.productId!, item.sellUnitId!))
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
      const previous = existingByKey.get(lineKey(item.id, item.sellUnitId))
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
