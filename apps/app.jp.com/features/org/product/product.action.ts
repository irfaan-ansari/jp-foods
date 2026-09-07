"use server"

import { and, eq, inArray } from "drizzle-orm"
import { db, product, productSellUnit } from "@jp/db"
import { AppError } from "@jp/utils"

import { orgActionClient } from "@/lib/safe-action"

import {
  createProductSchema,
  deleteProductSchema,
  updateProductSchema,
} from "./product.schema"

/**
 * create product
 */
export const createProduct = orgActionClient({ product: ["create"] })
  .inputSchema(createProductSchema)
  .action(async ({ clientInput, ctx }) => {
    const { data } = clientInput

    const exist = await db.query.product.findFirst({
      where: (p, { and, eq }) =>
        and(
          eq(p.organizationId, ctx.organizationId),
          eq(p.itemCode, data.itemCode)
        ),
    })

    if (exist)
      throw new AppError("CONFLICT", {
        message: "Item code already exist.",
      })

    const searchText = Object.values(data).join(" ")

    const [createdProduct] = await db
      .insert(product)
      .values({ ...data, searchText, organizationId: ctx.organizationId })
      .returning({ id: product.id })

    if (!createdProduct) throw new AppError("INVALID_REQUEST")

    const sellUnits = data.sellUnits.map((unit) => {
      const { id, ...rest } = unit
      return { ...rest, productId: createdProduct.id }
    })

    await db.insert(productSellUnit).values(sellUnits)

    return createdProduct
  })

/**
 * update product
 */
export const updateProduct = orgActionClient({ product: ["update"] })
  .inputSchema(updateProductSchema)
  .action(async ({ clientInput, ctx }) => {
    const { id, data } = clientInput

    const [exist, existingSellUnits] = await Promise.all([
      db.query.product.findFirst({
        where: (p, { and, eq }) =>
          and(eq(p.organizationId, ctx.organizationId), eq(p.id, id)),
      }),
      db.query.productSellUnit.findMany({
        where: (unit, { eq }) => eq(unit.productId, id),
      }),
    ])

    if (!exist)
      throw new AppError("NOT_FOUND", {
        message: "Product not found",
      })

    const searchText = Object.values(data).join(" ")
    const promises = [
      db
        .update(product)
        .set({ ...data, searchText })
        .where(eq(product.id, id))
        .returning({ id: product.id }),
    ] as Promise<unknown>[]

    // handle sell units
    const existingIds = new Set(existingSellUnits.map((unit) => unit.id))

    const incomingIds = new Set(
      data.sellUnits.filter((unit) => unit.id).map((unit) => unit.id)
    )

    const deleteIds = existingSellUnits
      .filter((unit) => !incomingIds.has(unit.id))
      .map((unit) => unit.id)
    if (deleteIds.length) {
      promises.push(
        db.delete(productSellUnit).where(inArray(productSellUnit.id, deleteIds))
      )
    }

    const newSellUnits = data.sellUnits
      .filter((unit) => !unit.id)
      .map(({ id: _, ...unit }) => ({
        ...unit,
        productId: id,
      }))
    if (newSellUnits.length) {
      promises.push(db.insert(productSellUnit).values(newSellUnits))
    }

    const updateSellUnits = data.sellUnits.filter(
      (unit) => unit.id && existingIds.has(unit.id)
    )

    updateSellUnits.map(({ id: sellUnitId, ...unit }) => {
      promises.push(
        db
          .update(productSellUnit)
          .set(unit)
          .where(
            and(
              eq(productSellUnit.id, Number(sellUnitId)),
              eq(productSellUnit.productId, id)
            )
          )
      )
    })
    await Promise.all(promises)

    return { id }
  })

/**
 * update product
 */
export const deleteProduct = orgActionClient({ product: ["delete"] })
  .inputSchema(deleteProductSchema)
  .action(async ({ clientInput, ctx }) => {
    const { id } = clientInput

    const exist = await db.query.product.findFirst({
      where: (p, { and, eq }) =>
        and(eq(p.organizationId, ctx.organizationId), eq(p.id, id)),
    })

    if (!exist)
      throw new AppError("NOT_FOUND", {
        message: "Product not found",
      })

    return await db
      .delete(product)
      .where(eq(product.id, id))
      .returning({ id: product.id })
  })
