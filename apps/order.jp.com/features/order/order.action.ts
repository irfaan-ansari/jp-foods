"use server"
import { orgActionClient } from "@/lib/safe-action"
import { db, order } from "@jp/db"
import { AppError } from "@jp/utils"
import { cancelOrderActionSchema } from "./order.schema"
import { eq } from "drizzle-orm"

export const cancelOrder = orgActionClient({ order: ["cancel"] })
  .inputSchema(cancelOrderActionSchema)
  .action(async ({ clientInput, ctx }) => {
    const { organizationId, teamId, session } = ctx
    const { data, id } = clientInput

    const existing = await db.query.order.findFirst({
      where: (o, { and, eq }) =>
        and(
          eq(o.id, id),
          eq(o.teamId, teamId),
          eq(o.organizationId, organizationId)
        ),
    })

    if (!existing) throw new AppError("NOT_FOUND")
    if (existing.status !== "in_progress")
      throw new AppError("INVALID_REQUEST", {
        message: "Order cannot be updated.",
        description: "Only orders in progress can be updated.",
      })

    await db
      .update(order)
      .set({
        status: "cancelled",
        cancelReason: data.cancelReason,
        cancelledBy: session.userId,
        cancelledAt: new Date(),
      })
      .where(eq(order.id, id))

    return { success: true }
  })
