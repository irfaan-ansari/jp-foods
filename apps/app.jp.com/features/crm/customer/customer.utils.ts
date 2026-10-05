import { CustomerApplicationSelectType } from "@jp/db"
import { sendEmail } from "@jp/notifications"
import {
  CustomerApplicationAdminEmail,
  CustomerApplicationApprovedEmail,
  CustomerApplicationDeclinedEmail,
  CustomerApplicationOnHoldEmail,
} from "@jp/notifications/templates"

type TriggerNotificationArgs = {
  application: CustomerApplicationSelectType
  status: string
  statusDetails?: string | null
  statusReason?: string | null
  internalNotes?: string | null
}

const getCustomerName = (application: CustomerApplicationSelectType) =>
  [application.officerFirst, application.officerLast].filter(Boolean).join(" ")

const getCustomerAddress = (application: CustomerApplicationSelectType) =>
  [
    application.companyStreet,
    application.companyCity,
    application.companyState,
    application.companyZip,
  ]
    .filter(Boolean)
    .join(" ")

const getAdminTemplate = ({
  application,
  status,
  statusDetails,
  statusReason,
  internalNotes,
}: TriggerNotificationArgs) =>
  CustomerApplicationAdminEmail({
    name: application.companyName,
    phone: application.companyPhone,
    email: application.companyEmail,
    address: getCustomerAddress(application),
    primaryContact: getCustomerName(application),
    primaryPhone: application.officerMobile,
    primaryEmail: application.officerEmail,
    status,
    statusReason: statusReason ?? undefined,
    statusDetails: statusDetails ?? undefined,
    internalNotes: internalNotes ?? undefined,
  })

export const triggerNotification = async ({
  application,
  status,
  statusDetails,
  statusReason,
  internalNotes,
}: TriggerNotificationArgs) => {
  const reason = statusReason ?? ""
  const reasonDetails = statusDetails ?? ""
  const customerName = getCustomerName(application)

  const adminEmail = sendEmail({
    subject: "Customer Application Status Update",
    template: getAdminTemplate({
      application,
      status,
      statusDetails,
      statusReason,
      internalNotes,
    }),
  })

  switch (status) {
    case "approved":
      return Promise.all([
        sendEmail({
          to: application.companyEmail,
          subject: "Jimenez Produce - Application Approved",
          template: CustomerApplicationApprovedEmail({
            name: customerName,
            company: application.companyName,
            portalUrl: process.env.JP_PORTAL_URL_CUSTOMER,
          }),
        }),
        adminEmail,
      ])
    case "under_review":
      return adminEmail
    case "on_hold":
      return Promise.all([
        sendEmail({
          to: application.companyEmail,
          subject: "Jimenez Produce - Application On-Hold",
          template: CustomerApplicationOnHoldEmail({
            name: customerName,
            reason,
            reasonDetails,
          }),
        }),
        adminEmail,
      ])
    case "rejected":
      return Promise.all([
        sendEmail({
          to: application.companyEmail,
          subject: "Jimenez Produce - Application Status Update",
          template: CustomerApplicationDeclinedEmail({
            name: customerName,
            company: application.companyName,
            reason,
            reasonDetails,
          }),
        }),
        adminEmail,
      ])
    default:
      return adminEmail
  }
}
