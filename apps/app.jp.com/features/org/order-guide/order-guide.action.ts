"use server"

import {
  createOdrerGuideSchema,
  deleteOdrerGuideSchema,
  updateOdrerGuideSchema,
} from "./order-guide.schema"
import { AppError } from "@jp/utils"
import { eq, inArray, sql } from "drizzle-orm"
import { orgActionClient } from "@/lib/safe-action"
import { db, orderGuide, orderGuideItem } from "@jp/db"

/**
 * create
 */
export const createOrderGuide = orgActionClient({ orderGuide: ["create"] })
  .inputSchema(createOdrerGuideSchema)
  .action(async ({ clientInput, ctx }) => {
    const { data } = clientInput
    const { productIds, teamId, ...rest } = data
    const organizationId = ctx.organizationId
    const createdBy = ctx.user.id

    const [created] = await db
      .insert(orderGuide)
      .values({ ...rest, organizationId, createdBy, teamId })
      .returning({
        id: orderGuide.id,
      })

    if (!created) throw new AppError("VALIDATION_ERROR")

    const items = productIds.map((p, i) => ({
      productId: p,
      position: i + 1,
      orderGuideId: created.id,
    }))

    await db.insert(orderGuideItem).values(items)
    return created
  })

/**
 * update
 */
export const updateOrderGuide = orgActionClient({ orderGuide: ["update"] })
  .inputSchema(updateOdrerGuideSchema)
  .action(async ({ clientInput, ctx }) => {
    const { data, id } = clientInput
    const { productIds, teamId, ...rest } = data
    const organizationId = ctx.organizationId

    const [existing, existingItems] = await Promise.all([
      db.query.orderGuide.findFirst({
        where: (og, { and, eq }) =>
          and(eq(og.organizationId, organizationId), eq(og.id, id)),
      }),
      db.query.orderGuideItem.findMany({
        where: (ogi, { eq }) => eq(ogi.orderGuideId, id),
      }),
    ])

    if (!existing) throw new AppError("NOT_FOUND")

    const toDeleteIds = existingItems
      .filter((item) => !productIds.includes(item.productId))
      .map((item) => item.id)

    const toUpsert = productIds.map((pId, i) => {
      return {
        productId: Number(pId),
        orderGuideId: id,
        position: i + 1,
        quantity: "1",
      }
    })

    const [updated] = await db
      .update(orderGuide)
      .set({ ...rest, organizationId, teamId })
      .where(eq(orderGuide.id, id))
      .returning({
        id: orderGuide.id,
      })

    if (!updated) throw new AppError("VALIDATION_ERROR")

    const promises: Promise<unknown>[] = [
      db
        .update(orderGuide)
        .set({ ...data })
        .where(eq(orderGuide.id, id))
        .returning(),
    ]

    // delete items
    if (toDeleteIds.length > 0) {
      promises.push(
        db.delete(orderGuideItem).where(inArray(orderGuideItem.id, toDeleteIds))
      )
    }

    // upsert items
    if (toUpsert.length > 0) {
      promises.push(
        db
          .insert(orderGuideItem)
          .values(toUpsert)
          .onConflictDoUpdate({
            target: [orderGuideItem.orderGuideId, orderGuideItem.productId],
            set: {
              position: sql`excluded.position`,
              quantity: sql`excluded.quantity`,
            },
          })
      )
    }

    return { id }
  })

/**
 * delete
 */
export const deleteOrderGuide = orgActionClient({ orderGuide: ["delete"] })
  .inputSchema(deleteOdrerGuideSchema)
  .action(async ({ clientInput, ctx }) => {
    const { id } = clientInput
    const organizationId = ctx.organizationId

    const existing = await db.query.orderGuide.findFirst({
      where: (og, { and, eq }) =>
        and(eq(og.organizationId, organizationId), eq(og.id, id)),
    })

    if (!existing) throw new AppError("NOT_FOUND")

    await db.delete(orderGuide).where(eq(orderGuide.id, id))

    return true
  })
