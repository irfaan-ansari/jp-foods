"use server"
import { handleAction } from "@/lib/action"
import { db, jobApplication, JobApplicationInsertType } from "@jp/db"
import { capitalize } from "@jp/utils"
import { headers } from "next/headers"

export const createJobApplication = handleAction(
  async (data: JobApplicationInsertType) => {
    const headersList = await headers()

    const realIp = headersList.get("x-real-ip")
    const forwardedFor = headersList.get("x-forwarded-for")
    const ip = forwardedFor?.split(",")[0] || realIp || "unknown"

    const values = {
      ...data,
      firstName: capitalize(data.firstName),
      lastName: capitalize(data.lastName),
      email: data.email.toLowerCase(),
      ipAddress: ip,
      status: "new",
      userAgent: headersList.get("user-agent"),
    }

    const [result] = await db.insert(jobApplication).values(values).returning()

    // send email

    return { id: result?.id }
  }
)
