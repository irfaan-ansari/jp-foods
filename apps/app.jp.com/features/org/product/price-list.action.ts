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
import { eq } from "drizzle-orm"
import { put } from "@vercel/blob"
import { CatalogPDF } from "@jp/pdf"
import { db, organization } from "@jp/db"
import { waitUntil } from "@vercel/functions"
import { sendEmail } from "@jp/notifications"
import { groupProducts } from "./price-list.utils"
import { orgActionClient } from "@/lib/safe-action"
import { renderToBuffer } from "@react-pdf/renderer"
import { WeeklyPriceListEmail } from "@jp/notifications/templates/weekly-price-list-email"

export const createPriceList = orgActionClient({ product: ["update"] })
  .inputSchema(
    z.object({
      timeZone: z.string().optional(),
    })
  )
  .action(async ({ ctx, parsedInput }) => {
    const { timeZone = "America/Chicago" } = parsedInput
    const organizationId = ctx.organizationId

    const now = toZonedTime(new Date(), timeZone)

    const effectiveFrom = isSaturday(now)
      ? startOfDay(now)
      : startOfDay(previousSaturday(now))

    const effectiveTo = isFriday(now)
      ? endOfDay(now)
      : endOfDay(nextFriday(now))

    waitUntil(
      Promise.all([
        generatePDF({
          effectiveFrom,
          effectiveTo,
          organizationId,
        }).then((pdfUrl) =>
          db
            .update(organization)
            .set({
              priceList: {
                url: pdfUrl,
                effectiveFrom: effectiveFrom.toISOString(),
                effectiveTo: effectiveTo.toISOString(),
                updatedAt: new Date().toISOString(),
              },
            })
            .where(eq(organization.id, organizationId))
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
      email: z.string(),
    })
  )
  .action(async ({ ctx, parsedInput }) => {
    const { email } = parsedInput

    const organizationId = ctx.organizationId

    const org = await db.query.organization.findFirst({
      where: (organization, { eq }) => eq(organization.id, organizationId),
    })

    waitUntil(
      sendEmail({
        to: [email],
        subject: "Weekly Product Catalog – Jimenez Produce Food Distribution",
        template: WeeklyPriceListEmail({
          name: "",
          pdfUrl: org?.priceList?.url || "",
        }),
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
  effectiveFrom,
  effectiveTo,
  organizationId,
}: {
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
    }),
  ])

  const products = allProducts.map((product) => ({
    ...product,
    price: (product.sellingUnits ?? []).find((unit) => unit.isDefault)?.price,
    uom: product.catchWeight ? product.uom : null,
  }))

  const groupedProducts = groupProducts(products)

  const buffer = await renderToBuffer(
    CatalogPDF({
      org: org!,
      effectiveFrom: effectiveFrom,
      effectiveTo: effectiveTo,
      featured: [],
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
