"use server"

import { authActionClient } from "@/lib/safe-action"
import {
  deleteCatalogInquirySchema,
  sendCatalogInquiryLinkSchema,
  updateCatalogInquirySchema,
} from "./catalog.schema"
import { CustomerInviteSelectType, customerInvite, db } from "@jp/db"
import { AppError } from "@jp/utils"
import { eq } from "drizzle-orm"
import { sendEmail } from "@jp/notifications"
import { CatalogAccessStatusUpdateEmail } from "@jp/notifications/templates"

const getCatalogAccessUrl = (token: string) =>
  `${process.env.BETTER_AUTH_URL}/api/v1/products/access?token=${token}&redirect=${process.env.JP_APP_URL}/products`

async function sendCatalogAccessEmail({
  inquiry,
  status,
  token,
}: {
  inquiry: Pick<
    CustomerInviteSelectType,
    "firstName" | "lastName" | "email" | "companyName" | "message"
  >
  status: string
  token?: string | null
}) {
  await sendEmail({
    to: inquiry.email,
    subject: "Jimenez Produce - Catalog Access Update",
    template: CatalogAccessStatusUpdateEmail({
      name: [inquiry.firstName, inquiry.lastName].filter(Boolean).join(" "),
      company: inquiry.companyName ?? "",
      message: inquiry.message ?? undefined,
      status: status as any,
      link: token ? getCatalogAccessUrl(token) : undefined,
    }),
  })
}

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

    if (exist.status !== data.status) {
      await sendCatalogAccessEmail({
        inquiry: exist,
        status: data.status,
        token,
      })
    }

    return { id }
  })

export const sendCatalogInquiryLink = authActionClient({
  "catalog-inquiry": ["update"],
})
  .inputSchema(sendCatalogInquiryLinkSchema)
  .action(async ({ clientInput }) => {
    const { id } = clientInput

    const inquiry = await db.query.customerInvite.findFirst({
      where: (c, { eq }) => eq(c.id, id),
    })
    if (!inquiry) throw new AppError("NOT_FOUND")
    if (inquiry.status !== "approved") {
      throw new AppError("INVALID_REQUEST", {
        message: "Catalog inquiry must be approved before sending link",
      })
    }

    const token = inquiry.token ?? crypto.randomUUID()

    if (!inquiry.token) {
      await db
        .update(customerInvite)
        .set({ token })
        .where(eq(customerInvite.id, id))
    }

    await sendCatalogAccessEmail({
      inquiry,
      status: "approved",
      token,
    })

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
