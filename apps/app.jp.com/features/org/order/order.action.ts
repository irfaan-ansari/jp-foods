"use server"
import { db, lineItem, order } from "@jp/db"
import { orgActionClient } from "@/lib/safe-action"
import {
  cancelOrderSchema,
  completeOrderActionSchema,
  generateInvoiceSchema,
  rescheduleOrderSchema,
  updateOrderSchema,
} from "./order.schema"
import { AppError } from "@jp/utils"
import { roundMoney } from "@jp/utils/commerce"
import { and, eq } from "drizzle-orm"
import type { BatchItem } from "drizzle-orm/batch"

/**
 * update order
 */
export const updateOrder = orgActionClient({ order: ["update"] })
  .inputSchema(updateOrderSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id, data } = parsedInput

    const existing = await db.query.order.findFirst({
      where: (o, { eq, and }) =>
        and(eq(o.id, id), eq(o.organizationId, ctx.organizationId)),
    })

    if (!existing) throw new AppError("NOT_FOUND")

    if (["cancelled", "completed"].includes(existing.status)) {
      throw new AppError("CONFLICT")
    }

    const [result] = await db
      .update(order)
      .set({
        ...data,
      })
      .where(
        and(
          eq(order.id, id),
          eq(order.organizationId, ctx.organizationId),
          eq(order.status, "in_progress")
        )
      )
      .returning({ id: order.id })
    return result
  })

/**
 * cancel order
 */
export const cancelOrder = orgActionClient({ order: ["cancel"] })
  .inputSchema(cancelOrderSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id } = parsedInput

    const existing = await db.query.order.findFirst({
      where: (o, { eq, and }) =>
        and(eq(o.id, id), eq(o.organizationId, ctx.organizationId)),
    })

    if (!existing) throw new AppError("NOT_FOUND")

    if (["cancelled", "completed"].includes(existing.status)) {
      throw new AppError("CONFLICT")
    }

    const [deleted] = await db
      .delete(order)
      .where(
        and(
          eq(order.id, id),
          eq(order.organizationId, ctx.organizationId),
          eq(order.status, "in_progress")
        )
      )
      .returning({ id: order.id })

    return deleted
  })

/**
 * complete order
 */
export const completeOrder = orgActionClient({ order: ["update"] })
  .inputSchema(completeOrderActionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id, data } = parsedInput

    const existing = await db.query.order.findFirst({
      where: (o, { and, eq }) =>
        and(eq(o.id, id), eq(o.organizationId, ctx.organizationId)),
      with: {
        lineItems: true,
      },
    })

    if (!existing) throw new AppError("NOT_FOUND")
    if (["cancelled", "completed"].includes(existing.status)) {
      throw new AppError("CONFLICT")
    }

    const submittedWeights = new Map(
      data.map((item) => [item.lineItemId, Number(item.unitQuantity)])
    )

    for (const [lineItemId, unitQuantity] of submittedWeights) {
      if (!Number.isFinite(unitQuantity) || unitQuantity < 0) {
        throw new AppError("INVALID_REQUEST")
      }

      const item = existing.lineItems.find((item) => item.id === lineItemId)
      if (!item || !item.catchWeight) throw new AppError("INVALID_REQUEST")
    }

    const charges = Number(existing.charges?.amount ?? 0)

    const totals = {
      lineItemTotal: 0,
      subtotal: 0,
      taxableSubtotal: 0,
      nonTaxableSubtotal: 0,
      taxAmount: 0,
    }

    const queries: BatchItem<"pg">[] = []

    for (const item of existing.lineItems) {
      const unitQuantity =
        submittedWeights.get(item.id) ?? Number(item.unitQuantity)
      const price = Number(item.price)

      if (!Number.isFinite(unitQuantity) || !Number.isFinite(price)) {
        throw new AppError("INVALID_REQUEST")
      }

      const subtotal = item.catchWeight
        ? roundMoney(price * unitQuantity)
        : Number(item.subtotal)
      const taxAmount = item.catchWeight
        ? item.isTaxable
          ? roundMoney((subtotal * Number(item.taxRate)) / 100)
          : 0
        : Number(item.taxAmount)
      const total = roundMoney(subtotal + taxAmount)

      if (!Number.isFinite(subtotal) || !Number.isFinite(taxAmount)) {
        throw new AppError("INVALID_REQUEST")
      }

      totals.lineItemTotal += subtotal
      totals.subtotal += subtotal
      totals.taxAmount += taxAmount
      if (item.isTaxable) {
        totals.taxableSubtotal += subtotal
      } else {
        totals.nonTaxableSubtotal += subtotal
      }

      if (item.catchWeight) {
        queries.push(
          db
            .update(lineItem)
            .set({
              unitQuantity: unitQuantity.toFixed(2),
              subtotal: subtotal.toFixed(2),
              taxAmount: taxAmount.toFixed(2),
              total: total.toFixed(2),
            })
            .where(
              and(
                eq(lineItem.id, item.id),
                eq(lineItem.orderId, id),
                eq(lineItem.organizationId, ctx.organizationId)
              )
            ) as BatchItem<"pg">
        )
      }
    }

    const subtotal = roundMoney(totals.subtotal)
    const taxAmount = roundMoney(totals.taxAmount)
    const total = roundMoney(subtotal + taxAmount + charges)

    queries.push(
      db
        .update(order)
        .set({
          status: "completed",
          deliveredAt: new Date(),
          lineItemTotal: roundMoney(totals.lineItemTotal).toFixed(2),
          subtotal: subtotal.toFixed(2),
          taxableSubtotal: roundMoney(totals.taxableSubtotal).toFixed(2),
          nonTaxableSubtotal: roundMoney(totals.nonTaxableSubtotal).toFixed(2),
          taxAmount: taxAmount.toFixed(2),
          total: total.toFixed(2),
        })
        .where(
          and(
            eq(order.id, id),
            eq(order.organizationId, ctx.organizationId),
            eq(order.status, "in_progress")
          )
        ) as BatchItem<"pg">
    )

    await db.batch(queries as [BatchItem<"pg">, ...BatchItem<"pg">[]])

    return { id }
  })

export const generateInvoice = orgActionClient({ order: ["update"] })
  .inputSchema(generateInvoiceSchema)
  .action(async ({ parsedInput, ctx }) => {
    return { id: 1 }
  })

/**
 * rescheule order
 */
export const rescheduleOrder = orgActionClient({ order: ["update"] })
  .inputSchema(rescheduleOrderSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id, data } = parsedInput
    const { deliveryDate, deliveryWindow } = data

    const existing = await db.query.order.findFirst({
      where: (o, { eq, and }) =>
        and(eq(o.id, id), eq(o.organizationId, ctx.organizationId)),
    })

    if (!existing) throw new AppError("NOT_FOUND")

    if (["cancelled", "completed"].includes(existing.status)) {
      throw new AppError("CONFLICT")
    }

    const [result] = await db
      .update(order)
      .set({
        deliveryDate: deliveryDate,
        deliveryWindow,
      })
      .where(
        and(
          eq(order.id, id),
          eq(order.organizationId, ctx.organizationId),
          eq(order.status, "in_progress")
        )
      )
      .returning({ id: order.id })

    return result
  })
