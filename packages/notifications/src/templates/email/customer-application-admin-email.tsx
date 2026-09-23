import { EmailLayout } from "./email-layout"
import { Section, Text } from "react-email"

interface CustomerApplicationAdminEmailProps {
  name: string
  phone: string
  email: string
  address: string
  primaryContact: string
  primaryPhone: string
  primaryEmail: string
  status: string
  statusDetails?: string
  statusReason?: string
  internalNotes?: string
}
const STATUS_MESSAGE = {
  new: "A new customer account application has been submitted.",
  under_review: "The customer account application is currently under review.",
  on_hold: "The customer account application has been placed on hold.",
  approved: "The customer account application has been approved.",
  rejected: "The customer account application has been declined.",
}
export const CustomerApplicationAdminEmail = ({
  name,
  phone,
  email,
  address,
  primaryContact,
  primaryEmail,
  primaryPhone,
  status = "new",
  statusDetails,
  statusReason,
  internalNotes,
}: CustomerApplicationAdminEmailProps) => {
  return (
    <EmailLayout heading="Customer Application Update" template="admin">
      <Section className="px-6 pt-3 pb-7 sm:px-8">
        <Text className="mb-3 text-base font-semibold text-text">
          Hello Team,
        </Text>

        <Text className="text-sm leading-6">
          {STATUS_MESSAGE[status as keyof typeof STATUS_MESSAGE] ??
            "A customer application has been updated."}
        </Text>

        <Section className="bg-details mt-5 rounded-lg border border-border px-5 py-1">
          <Text className="text-text text-sm font-semibold">
            Company Details
          </Text>
          <Text className="my-0 font-semibold">Company Name:</Text>
          <Text className="mt-0 text-secondary">{name || "N/A"}</Text>

          <Text className="my-0 font-semibold">Company Phone:</Text>
          <Text className="mt-0 text-secondary">{phone || "N/A"}</Text>

          <Text className="my-0 font-semibold">Company Email:</Text>
          <Text className="mt-0 text-secondary">{email || "N/A"}</Text>

          <Text className="my-0 font-semibold">Address:</Text>
          <Text className="mt-0 text-secondary">{address || "N/A"}</Text>

          <Text className="my-0 font-semibold">Primary Contact:</Text>
          <Text className="mt-0 text-secondary">{primaryContact || "N/A"}</Text>

          <Text className="my-0 font-semibold">Phone:</Text>
          <Text className="mt-0 text-secondary">{primaryPhone || "N/A"}</Text>

          <Text className="my-0 font-semibold">Email:</Text>
          <Text className="mt-0 text-secondary">{primaryEmail || "N/A"}</Text>
        </Section>
        {(statusReason || statusDetails || internalNotes) && (
          <Section className="bg-details mt-5 rounded-lg border border-border px-5 py-1">
            <Text className="text-text text-sm font-semibold">
              {statusReason ? `Reason: ${statusReason}` : "Application details"}
            </Text>
            {statusDetails && <Text className="text-sm leading-6">{statusDetails}</Text>}
            {internalNotes && (
              <>
                <Text className="text-text text-sm font-semibold">
                  Notes:
                </Text>
                <Text className="text-sm leading-6">{internalNotes}</Text>
              </>
            )}
          </Section>
        )}
      </Section>
    </EmailLayout>
  )
}

CustomerApplicationAdminEmail.PreviewProps = {
  name: "Example Market",
  phone: "555-0100",
  email: "office@example.com",
  address: "123 Market Street",
  primaryContact: "Alex Morgan",
  primaryPhone: "555-0101",
  primaryEmail: "alex@example.com",
  status: "new",
} satisfies Parameters<typeof CustomerApplicationAdminEmail>[0]

export default CustomerApplicationAdminEmail
