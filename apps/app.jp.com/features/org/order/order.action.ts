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
import { calculateOrder } from "@jp/utils/commerce"
import { and, eq } from "@jp/db/query"
import type { BatchItem } from "@jp/db/query/batch"

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

    if (["cancelled", "completed", "processing"].includes(existing.status)) {
      throw new AppError("CONFLICT")
    }

    const [result] = await db
      .update(order)
      .set({
        ...data,
      })
      .where(
        and(eq(order.id, id), eq(order.organizationId, ctx.organizationId))
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
          eq(order.status, "placed")
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

    if (existing.status !== "processing") {
      throw new AppError("CONFLICT", {
        message: "Only processing orders can be marked as complete.",
      })
    }
    const submittedWeights = new Map(
      data.map((d) => [d.lineItemId, Number(d.unitQuantity)])
    )

    const lineItems = existing.lineItems.map((item) => {
      const quantity = Number(item.quantity)
      const submitted = submittedWeights.get(item.id)

      const base = {
        id: item.id,
        pricingBasis: item.pricingBasis,
        quantity,
        isTaxable: !!item.isTaxable,
        taxRate: Number(item.taxRate ?? 0),
      }

      if (submitted === undefined) {
        return {
          ...base,
          price: Number(item.price),
          packSize: Number(item.packSize),
        }
      }

      return {
        ...base,
        price: Number(item.price),
        packSize: quantity ? submitted / quantity : 0,
      }
    })

    const { items, totals } = calculateOrder({
      items: lineItems,
      charges: Number(existing.charges?.amount ?? 0),
    })

    const queries: BatchItem<"pg">[] = items
      .filter((item) => submittedWeights.has(item.id))
      .map(
        (item) =>
          db
            .update(lineItem)
            .set({
              unitQuantity: item.unitQuantity.toFixed(2),
              subtotal: item.subtotal.toFixed(2),
              taxAmount: item.taxAmount.toFixed(2),
              total: item.total.toFixed(2),
            })
            .where(
              and(
                eq(lineItem.id, item.id),
                eq(lineItem.orderId, id),
                eq(lineItem.organizationId, ctx.organizationId)
              )
            ) as BatchItem<"pg">
      )

    queries.push(
      db
        .update(order)
        .set({
          status: "completed",
          deliveredAt: new Date(),
          lineItemTotal: totals.lineItemTotal.toFixed(2),
          subtotal: totals.subtotal.toFixed(2),
          taxableSubtotal: totals.taxableSubtotal.toFixed(2),
          nonTaxableSubtotal: totals.nonTaxableSubtotal.toFixed(2),
          taxAmount: totals.taxAmount.toFixed(2),
          total: totals.total.toFixed(2),
        })
        .where(
          and(
            eq(order.id, id),
            eq(order.organizationId, ctx.organizationId),
            eq(order.status, "processing")
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
          eq(order.status, "placed")
        )
      )
      .returning({ id: order.id })

    return result
  })
