"use server"

import { eq } from "drizzle-orm"
import { db, product } from "@jp/db"
import { AppError } from "@jp/utils"
import { orgActionClient } from "@/lib/safe-action"

import {
  createProductSchema,
  deleteProductSchema,
  ProductFormSchema,
  updateProductSchema,
} from "./product.schema"

const toProductData = (data: ProductFormSchema) => {
  const {
    pricingBasis,
    packSize,
    splitUnits,
    ...values
  } = data

  const pricedSplitUnits =
    splitUnits.map((unit) => {
      return {
        name: unit.name,
        displayLabel: unit.displayLabel || '',
        sellUnitPrice: Number(unit.sellUnitPrice),
        unitConversion: Number(unit.unitConversion),
      }
    }) ?? []

  return {
    ...values,
    price: String(data.price),
    pricingBasis,
    sellUOM: data.sellUOM,
    packSize: String(packSize),
    displayLabel: data.displayLabel,
    catchWeight: pricingBasis === "catch-weight",
    splitUnits: pricedSplitUnits,
  }
}

/**
 * create product
 */
export const createProduct = orgActionClient({ product: ["create"] })
  .inputSchema(createProductSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { data } = parsedInput

    const productData = toProductData({
      ...data,
      splitUnits: data.splitUnits ?? [],
    })

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

    if (existingOrgIds.has(ctx.organizationId)) {
      throw new AppError("INVALID_REQUEST", {
        message: "Item code already exists.",
      })
    }

    const orgsToInsert = orgs.filter((org) => !existingOrgIds.has(org.id))

    if (!orgsToInsert.some((org) => org.id === ctx.organizationId)) {
      throw new AppError("INVALID_REQUEST")
    }

    const searchText = Object.values(productData)
      .filter((value) => value != null)
      .map(String)
      .join(" ")

    const created = await db
      .insert(product)
      .values(
        orgsToInsert.map((org) => ({
          ...productData,
          searchText,
          organizationId: org.id,
          status: org.id === ctx.organizationId ? data.status : "draft",
        }))
      )
      .returning({ id: product.id, organizationId: product.organizationId })

    return created.find((p) => p.organizationId === ctx.organizationId)!
  })

/**
 * update product
 */
export const updateProduct = orgActionClient({ product: ["update"] })
  .inputSchema(updateProductSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id, data } = parsedInput

    const productData = toProductData({
      ...data,
      splitUnits: data.splitUnits ?? [],
    })

    const exist = await db.query.product.findFirst({
      where: (p, { and, eq }) =>
        and(eq(p.organizationId, ctx.organizationId), eq(p.id, id)),
    })

    if (!exist)
      throw new AppError("NOT_FOUND", {
        message: "Product not found",
      })

    const searchText = Object.values(productData).join(" ")

    await db
      .update(product)
      .set({ ...productData, searchText })
      .where(eq(product.id, id))
      .returning({ id: product.id })

    return { id }
  })

/**
 * update product
 */
export const deleteProduct = orgActionClient({ product: ["delete"] })
  .inputSchema(deleteProductSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id } = parsedInput

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
