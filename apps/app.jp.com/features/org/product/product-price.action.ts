"use server"

import { toZonedTime } from "date-fns-tz"
import {
  startOfDay,
  endOfDay,
  nextFriday,
  previousSaturday,
  isSaturday,
  isFriday,
  format,
} from "date-fns"
import z from "zod"
import { db } from "@jp/db"
import { eq } from "drizzle-orm"
import { catalog } from "@jp/db"
import { put } from "@vercel/blob"
import { CatalogPDF } from "@jp/pdf"
import { waitUntil } from "@vercel/functions"
import { sendEmail } from "@jp/notifications"
import { groupProducts } from "./price-list.utils"
import { orgActionClient } from "@/lib/safe-action"
import { renderToBuffer } from "@react-pdf/renderer"
import { WeeklyPriceListEmail } from "@jp/notifications/templates/weekly-price-list-email"

export const updateCatalog = orgActionClient({ product: ["update"] })
  .inputSchema(
    z.object({
      timeZone: z.string(),
    })
  )
  .action(async ({ ctx, parsedInput }) => {
    const { timeZone } = parsedInput
    const organizationId = ctx.organizationId

    const now = toZonedTime(new Date(), timeZone)

    const validFrom = isSaturday(now)
      ? startOfDay(now)
      : startOfDay(previousSaturday(now))

    const validUntil = isFriday(now) ? endOfDay(now) : endOfDay(nextFriday(now))

    let cat = await db.query.catalog.findFirst({
      where: (c, { eq }) => eq(c.organizationId, organizationId),
    })

    if (!cat) {
      ;[cat] = await db
        .insert(catalog)
        .values({
          name: "catalog",
          organizationId: organizationId,
          effectiveFrom: validFrom,
          effectiveTo: validUntil,
          pdfUrl: "",
        })
        .returning()
    }

    waitUntil(
      Promise.all([
        generatePDF({
          productIds: [],
          effectiveFrom: validFrom,
          effectiveTo: validUntil,
          organizationId,
        }).then((pdfUrl) =>
          db
            .update(catalog)
            .set({ pdfUrl, effectiveFrom: validFrom, effectiveTo: validUntil })
            .where(eq(catalog.id, cat?.id!))
        ),
      ])
    )
    return { success: true }
  })

/**
 * send brochure link to email
 */
export const emailPriceList = orgActionClient({ product: ["update"] })
  .inputSchema(
    z.object({
      id: z.number(),
      viewType: z.enum(["web", "pdf"]),
      email: z.string(),
    })
  )
  .action(async ({ ctx, parsedInput }) => {
    const { id, viewType, email } = parsedInput

    const response = await db.query.catalog.findFirst({
      where: (catalog, { eq }) => eq(catalog.id, id),
    })

    if (!response) throw new Error("Resource not found.")

    const pdfUrl = `https://jimenezproduce.com/api/products/catalog/${response.id}?view=${viewType}&source=email&email=${email}&share=true`

    waitUntil(
      sendEmail({
        to: [email],
        subject: "Weekly Product Catalog – Jimenez Produce Food Distribution",
        template: WeeklyPriceListEmail({ name: "", pdfUrl: pdfUrl }),
      })
    )

    return { success: true }
  })

/**
 * generate and upload brochure pdf to vercel blob storage
 * @param productIds
 * @returns
 */
const generatePDF = async ({
  productIds,
  effectiveFrom,
  effectiveTo,
  organizationId,
}: {
  productIds: number[]
  effectiveFrom: string | Date
  effectiveTo: string | Date
  organizationId: string
}) => {
  const [org, allProducts] = await Promise.all([
    db.query.organization.findFirst({
      where: (organization, { eq }) => eq(organization.id, organizationId),
    }),
    db.query.product.findMany({
      where: (product, { eq, and }) =>
        and(
          eq(product.organizationId, organizationId),
          eq(product.status, "active")
        ),
      with: {
        sellUnits: true,
      },
    }),
  ])

  const productIdSet = new Set(productIds)

  const featured = allProducts.filter((product) => productIdSet.has(product.id))

  const groupedProducts = groupProducts(allProducts)

  const buffer = await renderToBuffer(
    CatalogPDF({
      org: org!,
      effectiveFrom: effectiveFrom,
      effectiveTo: effectiveTo,
      featured: featured,
      products: groupedProducts,
    })
  )

  const startDate = format(effectiveFrom, "MMMM dd")
  const endDate = format(effectiveTo, "MMMM dd")

  const fileName = `Week of ${startDate} - ${endDate} - Jimenez Produce ${org?.name} Price List`

  const blob = await put(`catalog/${fileName}.pdf`, buffer, {
    access: "public",
    allowOverwrite: true,
    addRandomSuffix: true,
  })

  return blob.url
}
