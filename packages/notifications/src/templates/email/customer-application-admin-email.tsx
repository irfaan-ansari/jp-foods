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
      <Section className="p-6">
        <Text className="mb-2 text-xl font-semibold text-black">
          Hello Team,
        </Text>

        <Text className="text-lg">
          {STATUS_MESSAGE[status as keyof typeof STATUS_MESSAGE] ??
            "A customer application has been updated."}
        </Text>

        <Section className="border-email-border mt-6 border p-6">
          <Text className="my-0 text-lg font-semibold uppercase">
            Company Name:
          </Text>
          <Text className="text-email-secondary mt-0 text-base">
            {name || "N/A"}
          </Text>

          <Text className="my-0 text-lg font-semibold uppercase">
            Company Phone:
          </Text>
          <Text className="text-email-secondary mt-0 text-base">
            {phone || "N/A"}
          </Text>

          <Text className="my-0 text-lg font-semibold uppercase">
            Company Email:
          </Text>
          <Text className="text-email-secondary mt-0 text-base">
            {email || "N/A"}
          </Text>

          <Text className="my-0 text-lg font-semibold uppercase">Address:</Text>
          <Text className="text-email-secondary mt-0 text-base">
            {address || "N/A"}
          </Text>

          <Text className="my-0 text-lg font-semibold uppercase">
            Primary Contact:
          </Text>
          <Text className="text-email-secondary mt-0 text-base">
            {primaryContact || "N/A"}
          </Text>

          <Text className="my-0 text-base font-semibold">Phone:</Text>
          <Text className="text-email-secondary mt-0 text-base">
            {primaryPhone || "N/A"}
          </Text>

          <Text className="my-0 text-base font-semibold">Email:</Text>
          <Text className="text-email-secondary mt-0 text-base">
            {primaryEmail || "N/A"}
          </Text>
        </Section>
        {(statusReason || statusDetails || internalNotes) && (
          <Section className="border-email-border mt-6 border p-6">
            <Text className="text-email-brand mt-0 text-lg font-semibold uppercase">
              {statusReason ? `Reason: ${statusReason}` : "Application details"}
            </Text>
            {statusDetails && <Text className="text-lg">{statusDetails}</Text>}
            {internalNotes && (
              <>
                <Text className="text-email-brand mt-0 text-lg font-semibold uppercase">
                  Notes:
                </Text>
                <Text className="text-lg">{internalNotes}</Text>
              </>
            )}
          </Section>
        )}
      </Section>
    </EmailLayout>
  )
}
