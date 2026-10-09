import { sendEmail } from "@jp/notifications"
import {
  CandidateBackgroundCheckRequestEmail,
  JobApplicationAdminEmail,
  JobApplicationAgreementEmail,
  JobApplicationDeclinedEmail,
} from "@jp/notifications/templates"
import { ConsentV1PDF, JobApplicationPDF } from "@jp/pdf"
import { renderToBuffer } from "@jp/pdf/server"
import { env } from "@jp/utils/env"
import { waitUntil } from "@jp/utils/functions"

import type {
  CandidateEmailData,
  CandidateEmailStatus,
  SendCandidateEmailOptions,
} from "./candidate.type"

const getAdminEmail = ({
  candidate,
  status,
  statusDetails,
  statusReason,
  internalNotes,
}: {
  candidate: CandidateEmailData
  status: CandidateEmailStatus
  statusDetails?: string
  statusReason?: string
  internalNotes?: string
}) =>
  JobApplicationAdminEmail({
    name: candidate.firstName,
    location: candidate.location ?? "",
    email: candidate.email,
    phone: candidate.phone,
    position: candidate.position,
    status,
    statusReason,
    statusDetails,
    internalNotes,
  })

export const sendCandidateEmail = async ({
  candidate,
  status,
  statusDetails,
  statusReason,
  internalNotes,
}: SendCandidateEmailOptions) => {
  if (!status) return

  if (status === "rejected") {
    waitUntil(
      Promise.all([
        sendEmail({
          to: candidate.email,
          subject: "Jimenez Produce - Application Status Update",
          template: JobApplicationDeclinedEmail({
            name: candidate.firstName,
            position: candidate.position,
            reason: statusReason ?? "",
            detailedReason: statusDetails ?? "",
          }),
        }),
        sendEmail({
          subject: "Candidate Application Status Update",
          template: getAdminEmail({
            candidate,
            status,
            statusReason,
            statusDetails,
            internalNotes,
          }),
        }),
      ])
    )
    return
  }

  if (status === "under_verification") {
    const pdfBuffer = await renderToBuffer(
      JobApplicationPDF({ data: candidate, includeSSN: true })
    )

    const consentPDFBuffer = await renderToBuffer(
      ConsentV1PDF({ data: candidate })
    )
    const files = [
      { path: candidate.drivingLicenseFrontUrl, filename: "Driver's License" },
      { path: candidate.drivingLicenseBackUrl, filename: "Driver's License" },
      { path: candidate.dotFrontUrl, filename: "DOT" },
      { path: candidate.dotBackUrl, filename: "DOT" },
    ]

    waitUntil(
      Promise.all([
        sendEmail({
          subject: "Candidate Application Status Update",
          template: getAdminEmail({ candidate, status }),
          attachments: [
            ...files.filter((file) => file.path),
            {
              content: pdfBuffer.toString("base64"),
              filename: "Candidate PDF",
            },
            {
              content: consentPDFBuffer.toString("base64"),
              filename: "Authorization",
            },
          ],
        }),

        sendEmail({
          to: "compliance@rinehartandassociates.com",
          subject: `Background Check Request – Jimenez Produce`,
          template: CandidateBackgroundCheckRequestEmail({
            name: candidate.firstName + candidate.lastName,
            email: candidate.email,
            phone: candidate.phone,
            position: candidate.position,
            reference: `APP-${candidate.id}`,
          }),
          attachments: [
            ...files.filter((file) => file.path),
            {
              content: pdfBuffer.toString("base64"),
              filename: "Candidate PDF",
            },
            {
              content: consentPDFBuffer.toString("base64"),
              filename: "Authorization",
            },
          ],
        }),
      ])
    )
    return
  }

  if (status === "agreement_sent") {
    const agreementUrl = `${env.NEXT_PUBLIC_PUBLIC_URL}/careers/agreement?token=${candidate.token}`

    waitUntil(
      Promise.all([
        sendEmail({
          to: candidate.email,
          subject: "Jimenez Produce - Employment Agreement",
          template: JobApplicationAgreementEmail({
            name: candidate.firstName,
            position: candidate.position,
            agreementUrl,
          }),
        }),
        sendEmail({
          subject: "Candidate Application Status Update",
          template: getAdminEmail({
            candidate,
            status,
            statusDetails,
            statusReason,
            internalNotes,
          }),
        }),
      ])
    )
    return
  }

  if (status === "hired") {
    waitUntil(
      sendEmail({
        subject: "Candidate Application Status Update",
        template: getAdminEmail({
          candidate,
          status,
          statusDetails,
          statusReason,
          internalNotes,
        }),
      })
    )
  }
}

export const startVerification = async () => {
  return true
}

export const startOnboarding = async () => {
  return true
}
