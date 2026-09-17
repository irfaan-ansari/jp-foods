"use server"

import { authActionClient } from "@/lib/safe-action"
import {
  deleteCatalogInquirySchema,
  updateCatalogInquirySchema,
} from "./catalog.schema"
import { customerInvite, db } from "@jp/db"
import { AppError } from "@jp/utils"
import { eq } from "drizzle-orm"

export const updateCatalogInquiry = authActionClient({
  "catalog-inquiry": ["update"],
})
  .inputSchema(updateCatalogInquirySchema)
  .action(async ({ ctx, clientInput }) => {
    const { user } = ctx
    const { id, data } = clientInput

    const exist = await db.query.customerInvite.findFirst({
      where: (c, { eq }) => eq(c.id, id),
    })
    if (!exist) throw new AppError("NOT_FOUND")

    const token = data.status === "approved" ? crypto.randomUUID() : null

    await db
      .update(customerInvite)
      .set({
        status: data.status,
        reviewedBy: user.id,
        reviewedAt: new Date(),
        token,
      })
      .where(eq(customerInvite.id, id))

    // enquee email
    return { id }
  })

/** delete */
export const deleteCatalogInquiry = authActionClient({
  "catalog-inquiry": ["delete"],
})
  .inputSchema(deleteCatalogInquirySchema)
  .action(async ({ ctx, clientInput }) => {
    const { user } = ctx
    const { id } = clientInput

    const exist = await db.query.customerInvite.findFirst({
      where: (c, { eq }) => eq(c.id, id),
    })
    if (!exist) throw new AppError("NOT_FOUND")

    await db.delete(customerInvite).where(eq(customerInvite.id, id))

    // enquee email
    return { id }
  })
