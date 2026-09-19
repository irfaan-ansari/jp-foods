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

    const orgs = await db.query.organization.findMany({
      columns: {
        id: true,
      },
    })

    const existing = await db.query.product.findMany({
      where: (p, { and, eq, inArray }) =>
        and(
          inArray(
            p.organizationId,
            orgs.map((org) => org.id)
          ),
          eq(p.itemCode, data.itemCode)
        ),
      columns: {
        id: true,
        organizationId: true,
      },
    })

    const existingOrgIds = new Set(existing.map((p) => p.organizationId))

    const orgsToInsert = orgs.filter((org) => !existingOrgIds.has(org.id))

    const searchText = Object.values(data)
      .filter((value) => value != null)
      .map(String)
      .join(" ")

    const createdProducts = orgsToInsert.length
      ? await db
          .insert(product)
          .values(
            orgsToInsert.map((org) => ({
              ...data,
              status: org.id === ctx.organizationId ? "active" : "draft",
              searchText,
              organizationId: org.id,
            }))
          )
          .returning({
            id: product.id,
            organizationId: product.organizationId,
          })
      : []

    const currentOrg =
      createdProducts.find(
        (product) => product.organizationId === ctx.organizationId
      ) ?? existing.find((p) => p.organizationId === ctx.organizationId)

    if (!currentOrg) {
      throw new AppError("INVALID_REQUEST")
    }

    return currentOrg
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

export const importProduct = orgActionClient({ product: ["delete"] }).action(
  async ({ ctx }) => {
    const organizationId = ctx.organizationId
    // TODO: implement import product
  }
)
