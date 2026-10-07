"use server"

import { handleAction } from "@/lib/action"
import { db, jobApplication } from "@jp/db"
import { and, eq } from "@jp/db/query"
import { renderToBuffer } from "@jp/pdf/server"
import { JobAgreementPDF } from "@jp/pdf"
import { uploadFile } from "@jp/utils/blob/client"
import { waitUntil } from "@jp/utils/functions"
import { sendEmail } from "@jp/notifications"
import { EmploymentAgreementSubmittedEmail } from "@jp/notifications/templates"

export const getJobApplication = handleAction(async (token: string) => {
  if (!token) throw new Error("Invalid request")

  const res = await db.query.jobApplication.findFirst({
    where: eq(jobApplication.token, token),
  })

  if (!res) throw new Error("Invalid request")

  return {
    name: `${res.firstName} ${res.lastName}`,
    position: res.position,
    facility: res.location,
    signatureUrl: res.signatureUrl,
  }
})

// generate and save agreement pdf
export const submitAgreement = handleAction(async (token: string) => {
  if (!token) throw new Error("Invalid request")

  const res = await db.query.jobApplication.findFirst({
    where: eq(jobApplication.token, token),
  })

  if (!res) throw new Error("Invalid request")

  const agreementDate = new Date().toISOString()

  const name = `${res.firstName} ${res.lastName}`.trim()

  const buffer = await renderToBuffer(
    JobAgreementPDF({
      data: { ...res, applicantName: name, agreementDate },
    })
  )

  const blob = await uploadFile({
    file: new File([new Uint8Array(buffer).buffer], "agreement.pdf", {
      type: "application/pdf",
    }),
    path: `documents/agreement/${res.id}`,
  })

  await db
    .update(jobApplication)
    .set({
      agreementUrl: blob.url,
      agreementDate,
      token: null,
      status: "agreement_signed",
    })
    .where(and(eq(jobApplication.id, res.id), eq(jobApplication.token, token)))

  waitUntil(
    sendEmail({
      subject: "New Employment Agreement Submitted",
      template: EmploymentAgreementSubmittedEmail({
        name: `${res.firstName} ${res.lastName}`,
        email: res.email,
        position: res.position,
        facility: res.location,
        submittedAt: agreementDate,
        agreementUrl: blob.url,
      }),
    })
  )

  return { id: res.id }
})
