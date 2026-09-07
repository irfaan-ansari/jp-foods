"use server"
import { db, order } from "@jp/db"
import { orgActionClient } from "@/lib/safe-action"
import {
  cancelOrderSchema,
  completeOrderSchema,
  rescheduleOrderSchema,
  updateOrderSchema,
} from "./order.schema"
import { AppError } from "@jp/utils"
import { eq } from "drizzle-orm"

/**
 * update order
 */
export const updateOrder = orgActionClient({ order: ["update"] })
  .inputSchema(updateOrderSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id, data } = parsedInput

    const existing = await db.query.order.findFirst({
      where: (o, { eq }) => eq(o.id, id),
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
      .where(eq(order.id, id))
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
      where: (o, { eq }) => eq(o.id, id),
    })

    if (!existing) throw new AppError("NOT_FOUND")

    if (["cancelled", "completed"].includes(existing.status)) {
      throw new AppError("CONFLICT")
    }

    const [deleted] = await db
      .delete(order)
      .where(eq(order.id, id))
      .returning({ id: order.id })

    return deleted
  })

/**
 * complete order
 */
export const completeOrder = orgActionClient({ order: ["update"] })
  .inputSchema(completeOrderSchema)
  .action(async ({ parsedInput }) => {
    const { id } = parsedInput

    const existing = await db.query.order.findFirst({
      where: (o, { eq }) => eq(o.id, id),
    })

    if (!existing) throw new AppError("NOT_FOUND")

    if (["cancelled", "completed"].includes(existing.status)) {
      throw new AppError("CONFLICT")
    }

    const [result] = await db
      .update(order)
      .set({
        status: "completed",
      })
      .where(eq(order.id, id))
      .returning({ id: order.id })

    return result
  })

/**
 * rescheule order
 */
export const rescheduleOrder = orgActionClient({ order: ["update"] })
  .inputSchema(rescheduleOrderSchema)
  .action(async ({ parsedInput }) => {
    const { id, data } = parsedInput
    const { deliveryDate, deliveryWindow } = data

    const existing = await db.query.order.findFirst({
      where: (o, { eq }) => eq(o.id, id),
    })

    if (!existing) throw new AppError("NOT_FOUND")

    if (["cancelled", "completed"].includes(existing.status)) {
      throw new AppError("CONFLICT")
    }

    const [result] = await db
      .update(order)
      .set({
        deliveryDate,
        deliveryWindow,
      })
      .where(eq(order.id, id))
      .returning({ id: order.id })

    return result
  })
