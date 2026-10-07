"use server"

import { and, eq, or } from "@jp/db/query"
import { customer, db, jobApplication } from "@jp/db"

export type TrackingType = "customer" | "job"

export type TrackingStatus = {
  type: TrackingType
  id: number
  title: string
  status: string
  statusReason: string | null
  statusDetails: string | null
  submittedAt: Date | null
  updatedAt: Date | null
}

export type TrackingState = {
  error?: string
  result?: TrackingStatus
}

const cleanEmail = (value: FormDataEntryValue | null) =>
  String(value ?? "")
    .trim()
    .toLowerCase()

const getApplicationType = (
  value: FormDataEntryValue | null
): TrackingType | null => {
  if (value === "customer" || value === "job") return value
  return null
}

export const trackApplication = async (
  _prevState: TrackingState,
  formData: FormData
): Promise<TrackingState> => {
  const type = getApplicationType(formData.get("type"))
  const email = cleanEmail(formData.get("email"))
  const id = Number(formData.get("id"))

  if (!type) {
    return { error: "Choose the application type you want to track." }
  }

  if (!Number.isInteger(id) || id <= 0) {
    return { error: "Enter a valid application number." }
  }

  if (!email || !email.includes("@")) {
    return { error: "Enter the email address used on your application." }
  }

  if (type === "customer") {
    const result = await db.query.customer.findFirst({
      columns: {
        id: true,
        companyName: true,
        companyEmail: true,
        officerEmail: true,
        status: true,
        statusReason: true,
        statusDetails: true,
        createdAt: true,
        updatedAt: true,
      },
      where: and(
        eq(customer.id, id),
        or(eq(customer.companyEmail, email), eq(customer.officerEmail, email))
      ),
    })

    if (!result) {
      return {
        error:
          "We could not find a customer application with that number and email.",
      }
    }

    return {
      result: {
        type,
        id: result.id,
        title: result.companyName,
        status: result.status,
        statusReason: result.statusReason,
        statusDetails: result.statusDetails,
        submittedAt: result.createdAt,
        updatedAt: result.updatedAt,
      },
    }
  }

  const result = await db.query.jobApplication.findFirst({
    columns: {
      id: true,
      applicantName: true,
      email: true,
      position: true,
      status: true,
      statusReason: true,
      statusDetails: true,
      createdAt: true,
      updatedAt: true,
    },
    where: and(eq(jobApplication.id, id), eq(jobApplication.email, email)),
  })

  if (!result) {
    return {
      error: "We could not find a job application with that number and email.",
    }
  }

  return {
    result: {
      type,
      id: result.id,
      title: result.position,
      status: result.status,
      statusReason: result.statusReason,
      statusDetails: result.statusDetails,
      submittedAt: result.createdAt,
      updatedAt: result.updatedAt,
    },
  }
}
