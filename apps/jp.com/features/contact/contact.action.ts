"use server"

import { db, customerInvite } from "@jp/db"
import { sendEmail } from "@jp/notifications"
import {
  CatalogAccessAdminEmail,
  CatalogAccessRequestReceivedEmail,
} from "@jp/notifications/templates"
import { headers } from "next/headers"
import { handleAction } from "@/lib/action"
import { CONTACT_SCHEMA } from "./contact.schema"
import { waitUntil } from "@vercel/functions"

export const createInvite = handleAction(async (input: unknown) => {
  const data = CONTACT_SCHEMA.parse(input)
  const headersList = await headers()

  const realIp = headersList.get("x-real-ip")
  const forwardedFor = headersList.get("x-forwarded-for")
  const ip = forwardedFor?.split(",")[0] || realIp || "unknown"
  const [firstName = data.name, ...lastNameParts] = data.name.trim().split(" ")
  const lastName = lastNameParts.join(" ")

  const values = {
    firstName,
    lastName,
    phone: data.phone,
    email: data.email.toLowerCase(),
    companyName: data.companyName,
    companyType: data.companyType,
    type: "request",
    status: "new",
    message: data.message,
    ipAddress: ip,
    userAgent: headersList.get("user-agent"),
  }

  const [result] = await db
    .insert(customerInvite)
    .values(values)
    .returning({ id: customerInvite.id })

  waitUntil(
    Promise.all([
      sendEmail({
        to: data.email,
        subject: "Jimenez Produce - Catalog Access Request Received",
        template: CatalogAccessRequestReceivedEmail({
          name: data.name,
          company: data.companyName,
          message: data.message,
        }),
      }),
      sendEmail({
        subject: "New catalog access request",
        template: CatalogAccessAdminEmail({
          name: data.name,
          company: data.companyName,
          companyType: data.companyType,
          email: data.email,
          phone: data.phone,
          message: data.message,
          status: "new",
        }),
      }),
    ])
  )

  return { id: result?.id }
})
