"use server"
import { db, order } from "@jp/db"
import { orgActionClient } from "@/lib/safe-action"
import {
  cancelOrderSchema,
  completeOrderActionSchema,
  generateInvoiceSchema,
  rescheduleOrderSchema,
  updateOrderSchema,
} from "./order.schema"
import { AppError } from "@jp/utils"
import { and, eq } from "drizzle-orm"

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
    return { id: 1 }
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
