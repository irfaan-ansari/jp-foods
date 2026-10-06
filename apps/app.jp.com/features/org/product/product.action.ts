"use server"

import { and, eq } from "drizzle-orm"
import { db, product } from "@jp/db"
import { AppError } from "@jp/utils"
import { orgActionClient } from "@/lib/safe-action"

import {
  createProductSchema,
  deleteProductSchema,
  productPriceImportSchema,
  ProductFormSchema,
  updateProductSchema,
} from "./product.schema"
import { triggerPriceListGeneration } from "./price-list.action"

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

export const importProductPrices = orgActionClient({ product: ["update"] })
  .inputSchema(productPriceImportSchema)
  .action(async ({ parsedInput, ctx }) => {
    const result = {
      total: parsedInput.rows.length,
      updated: 0,
      notFound: [] as string[],
      skipped: 0,
    }

    for (const row of parsedInput.rows) {
      const data: Partial<{
        price: string
        stock: string
        stockUOM: string
        sellUOM: string
      }> = {}

      if (row.price !== undefined && row.price !== "") data.price = row.price
      if (row.stock !== undefined && row.stock !== "") data.stock = row.stock
      if (row.stockUOM !== undefined && row.stockUOM !== "") {
        data.stockUOM = row.stockUOM
      }
      if (row.sellUOM !== undefined && row.sellUOM !== "") {
        data.sellUOM = row.sellUOM
      }

      if (Object.keys(data).length === 0) {
        result.skipped += 1
        continue
      }

      const updated = await db
        .update(product)
        .set(data)
        .where(
          and(
            eq(product.organizationId, ctx.organizationId),
            eq(product.itemCode, row.itemCode)
          )
        )
        .returning({ id: product.id })

      if (updated.length === 0) {
        result.notFound.push(row.itemCode)
      } else {
        result.updated += 1
      }
    }

    if (result.updated > 0) {
      await triggerPriceListGeneration({ organizationId: ctx.organizationId })
    }

    return result
  })
