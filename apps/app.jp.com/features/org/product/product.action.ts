"use server"

import { eq } from "drizzle-orm"
import { db, product } from "@jp/db"
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

    return createdProduct
  })

/**
 * update product
 */
export const updateProduct = orgActionClient({ product: ["update"] })
  .inputSchema(updateProductSchema)
  .action(async ({ clientInput, ctx }) => {
    const { id, data } = clientInput

    const exist = await db.query.product.findFirst({
      where: (p, { and, eq }) =>
        and(eq(p.organizationId, ctx.organizationId), eq(p.id, id)),
    })

    if (!exist)
      throw new AppError("NOT_FOUND", {
        message: "Product not found",
      })

    const searchText = Object.values(data).join(" ")

    await db
      .update(product)
      .set({ ...data, searchText })
      .where(eq(product.id, id))
      .returning({ id: product.id })

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
