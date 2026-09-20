"use server"

import { and, eq } from "drizzle-orm"

import { orgActionClient } from "@/lib/safe-action"
import { AppError } from "@jp/utils"
import { db, promotion, promotionTarget } from "@jp/db"
import {
  createPromotionSchema,
  deletePromotionSchema,
  updatePromotionStatusSchema,
  updatePromotionSchema,
} from "./promotion.schema"

const toPromotionValues = (
  data: (typeof createPromotionSchema)["_output"]["data"]
) => ({
  name: data.name,
  media: data.media,
  status: data.status,
  placement: [data.placement],
  productIds: data.productIds,
  triggerProductIds: data.triggerProductIds,
})

const replacePromotionTargets = async (
  promotionId: number,
  teamIds: string[]
) => {
  await db
    .delete(promotionTarget)
    .where(eq(promotionTarget.promotionId, promotionId))

  if (teamIds.length === 0) return

  await db.insert(promotionTarget).values(
    teamIds.map((teamId) => ({
      promotionId,
      teamId,
    }))
  )
}

export const createPromotion = orgActionClient({ promotion: ["create"] })
  .inputSchema(createPromotionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { data } = parsedInput

    const [created] = await db
      .insert(promotion)
      .values({
        ...toPromotionValues(data),
        target: data.teamIds.length > 0 ? "selected" : "all",
        organizationId: ctx.organizationId,
      })
      .returning({ id: promotion.id })

    if (!created) throw new AppError("VALIDATION_ERROR")

    await replacePromotionTargets(created.id, data.teamIds)

    return created
  })

export const updatePromotion = orgActionClient({ promotion: ["update"] })
  .inputSchema(updatePromotionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id, data } = parsedInput

    const existing = await db.query.promotion.findFirst({
      where: (p, { and, eq }) =>
        and(eq(p.id, id), eq(p.organizationId, ctx.organizationId)),
    })

    if (!existing) throw new AppError("NOT_FOUND")

    await db
      .update(promotion)
      .set({
        ...toPromotionValues(data),
        target: data.teamIds.length > 0 ? "selected" : "all",
      })
      .where(
        and(
          eq(promotion.id, id),
          eq(promotion.organizationId, ctx.organizationId)
        )
      )

    await replacePromotionTargets(id, data.teamIds)

    return { id }
  })

export const deletePromotion = orgActionClient({ promotion: ["delete"] })
  .inputSchema(deletePromotionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id } = parsedInput

    const existing = await db.query.promotion.findFirst({
      where: (p, { and, eq }) =>
        and(eq(p.id, id), eq(p.organizationId, ctx.organizationId)),
    })

    if (!existing) throw new AppError("NOT_FOUND")

    await db
      .delete(promotion)
      .where(
        and(
          eq(promotion.id, id),
          eq(promotion.organizationId, ctx.organizationId)
        )
      )

    return { id }
  })

export const updatePromotionStatus = orgActionClient({ promotion: ["update"] })
  .inputSchema(updatePromotionStatusSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id, status } = parsedInput

    const existing = await db.query.promotion.findFirst({
      where: (p, { and, eq }) =>
        and(eq(p.id, id), eq(p.organizationId, ctx.organizationId)),
    })

    if (!existing) throw new AppError("NOT_FOUND")

    await db
      .update(promotion)
      .set({ status })
      .where(
        and(
          eq(promotion.id, id),
          eq(promotion.organizationId, ctx.organizationId)
        )
      )

    return { id, status }
  })
