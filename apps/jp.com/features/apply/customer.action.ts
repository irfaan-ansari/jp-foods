"use server"

import { db, customer } from "@jp/db"
import { handleAction } from "@/lib/action"
import { headers } from "next/headers"
import { capitalize } from "@jp/utils"
import { CustomerApplicationInsertType } from "@jp/db"

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

    const [result] = await db.insert(customer).values(values).returning()

    return { id: result?.id }
  }
)
