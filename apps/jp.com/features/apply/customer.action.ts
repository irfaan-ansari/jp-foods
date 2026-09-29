"use server"

import { db, customer } from "@jp/db"
import { handleAction } from "@/lib/action"
import { headers } from "next/headers"
import { capitalize } from "@jp/utils"
import { sendEmail } from "@jp/notifications"
import { CustomerApplicationInsertType } from "@jp/db"
import CustomerApplicationReceivedEmail from "@jp/notifications/templates/customer-application-received-email"

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

    await sendEmail({
      to: data.companyEmail,
      subject: "New customer application",
      template: CustomerApplicationReceivedEmail({
        name: data.officerFirst,
        company: data.companyName,
      }),
    })

    return { id: result?.id }
  }
)
