"use server"
import { handleAction } from "@/lib/action"
import { db, jobApplication, JobApplicationInsertType } from "@jp/db"
import { sendEmail } from "@jp/notifications"
import {
  JobApplicationAdminEmail,
  JobApplicationReceivedEmail,
} from "@jp/notifications/templates"
import { capitalize } from "@jp/utils"
import { waitUntil } from "@jp/utils/functions"
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

    waitUntil(
      Promise.all([
        sendEmail({
          to: data.email,
          subject: `Jimenez Produce - Application Received`,
          template: JobApplicationReceivedEmail({
            name: data.firstName,
            position: data.position,
          }),
        }),
        sendEmail({
          subject: "New candidate application",
          template: JobApplicationAdminEmail({
            name: data.firstName,
            position: data.position,
            location: data.location ?? "NA",
            email: data.email,
            phone: data.phone,

            status: "new",
          }),
        }),
      ])
    )

    return { id: result?.id }
  }
)
