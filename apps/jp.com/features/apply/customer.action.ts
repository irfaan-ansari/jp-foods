"use server"

import { db, customer } from "@jp/db"
import { handleAction } from "@/lib/action"
import { headers } from "next/headers"
import { capitalize } from "@jp/utils"
import { sendEmail } from "@jp/notifications"
import { CustomerApplicationInsertType } from "@jp/db"
import CustomerApplicationReceivedEmail from "@jp/notifications/templates/customer-application-received-email"
import { CustomerApplicationAdminEmail } from "@jp/notifications/templates"
import { waitUntil } from "@vercel/functions"

export const createCustomer = handleAction(
  async (data: CustomerApplicationInsertType) => {
    const headersList = await headers()

    const realIp = headersList.get("x-real-ip")
    const forwardedFor = headersList.get("x-forwarded-for")
    const ip = forwardedFor?.split(",")[0] || realIp || "unknown"

    const values = {
      ...data,
      officerFirst: capitalize(data.officerFirst),
      officerLast: capitalize(data.officerLast),
      companyEmail: data.companyEmail.toLowerCase(),
      officerEmail: data.officerEmail.toLowerCase(),
      ipAddress: ip,
      userAgent: headersList.get("user-agent"),
      thumbnail: "",
    }

    const [result] = await db
      .insert(customer)
      .values(values)
      .returning({ id: customer.id })

    waitUntil(
      Promise.all([
        sendEmail({
          to: data.companyEmail,
          subject: `Jimenez Produce - Application Received`,
          template: CustomerApplicationReceivedEmail({
            name: data.officerFirst,
            company: data.companyName,
          }),
        }),
        sendEmail({
          subject: "New customer application",
          template: CustomerApplicationAdminEmail({
            name: data.companyName,
            phone: data.companyPhone,
            email: data.companyEmail,
            address: [
              data.companyStreet,
              data.companyCity,
              data.companyState,
              data.companyZip,
            ].join(" "),
            primaryContact: data.officerFirst,
            primaryPhone: data.officerMobile,
            primaryEmail: data.officerEmail,
            status: "new",
          }),
        }),
      ])
    )

    return { id: result?.id }
  }
)
