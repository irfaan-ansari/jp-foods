"use server"
import { orgActionClient } from "@/lib/safe-action"
import {
  createPriceLevelSchema,
  deletePriceLevelSchema,
  updatePriceLevelSchema,
} from "./price-level.schema"
import { db, priceLevel, priceLevelItem } from "@jp/db"
import { AppError } from "@jp/utils"
import { and, eq, inArray, sql } from "drizzle-orm"

/**
 * create
 */
export const createPriceLevel = orgActionClient({ priceLevel: ["create"] })
  .inputSchema(createPriceLevelSchema)
  .action(async ({ clientInput, ctx }) => {
    const organizationId = ctx.organizationId

    const { data } = clientInput
    const { products, appliesTo, ...rest } = data

    const [result] = await db
      .insert(priceLevel)
      .values({ ...rest, appliesTo, organizationId })
      .returning({ id: priceLevel.id })

    if (!result) throw new AppError("VALIDATION_ERROR")

    if (appliesTo === "per_item" && products.length > 0) {
      const priceLevelItemValues = products.map((p) => ({
        productId: p.id,
        price: p.price,
        priceLevelId: result.id,
      }))
      await db.insert(priceLevelItem).values(priceLevelItemValues)
    }

    return result
  })

/**
 * update
 */
export const updatePriceLevel = orgActionClient({
  priceLevel: ["update"],
})
  .inputSchema(updatePriceLevelSchema)
  .action(async ({ clientInput, ctx }) => {
    const organizationId = ctx.organizationId
    const { id, data } = clientInput

    const { products, appliesTo, ...rest } = data

    const [existing, existingItems] = await Promise.all([
      db.query.priceLevel.findFirst({
        where: (pl, { and, eq }) =>
          and(eq(pl.organizationId, organizationId), eq(pl.id, id)),
      }),

      db.query.priceLevelItem.findMany({
        where: (item, { eq }) => eq(item.priceLevelId, id),
      }),
    ])

    if (!existing) {
      throw new AppError("NOT_FOUND")
    }

    const [result] = await db
      .update(priceLevel)
      .set({
        ...rest,
        appliesTo,
      })
      .where(
        and(
          eq(priceLevel.id, id),
          eq(priceLevel.organizationId, organizationId)
        )
      )
      .returning({
        id: priceLevel.id,
      })

    if (!result) {
      throw new AppError("VALIDATION_ERROR")
    }

    const priceLevelItems =
      appliesTo === "per_item"
        ? products.map((product) => ({
            priceLevelId: result.id,
            productId: product.id,
            price: product.price,
          }))
        : []

    const toDelete = existingItems
      .filter(
        (existingItem) =>
          !priceLevelItems.some(
            (item) => item.productId === existingItem.productId
          )
      )
      .map((item) => item.id)

    const promises: Promise<unknown>[] = []

    if (toDelete.length > 0) {
      promises.push(
        db.delete(priceLevelItem).where(inArray(priceLevelItem.id, toDelete))
      )
    }

    if (priceLevelItems.length > 0) {
      promises.push(
        db
          .insert(priceLevelItem)
          .values(priceLevelItems)
          .onConflictDoUpdate({
            target: [priceLevelItem.priceLevelId, priceLevelItem.productId],
            set: {
              price: sql`excluded.price`,
            },
          })
      )
    }

    await Promise.all(promises)

    return result
  })

/**
 * delete
 */

export const deletePriceLevel = orgActionClient({ priceLevel: ["delete"] })
  .inputSchema(deletePriceLevelSchema)
  .action(async ({ clientInput, ctx }) => {
    const organizationId = ctx.organizationId

    const { id } = clientInput

    const existing = await db.query.priceLevel.findFirst({
      where: (pl, { and, eq }) =>
        and(eq(pl.organizationId, organizationId), eq(pl.id, id)),
    })

    if (!existing) throw new AppError("NOT_FOUND")
    await db.delete(priceLevel).where(eq(priceLevel.id, id))

    return true
  })
