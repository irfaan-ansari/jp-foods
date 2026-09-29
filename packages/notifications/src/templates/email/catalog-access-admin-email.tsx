import { EmailLayout } from "./email-layout"
import { Section, Text } from "react-email"

interface CatalogAccessAdminEmailProps {
  name: string
  company: string
  companyType: string
  email: string
  phone: string
  message: string
  status?: string
}

const STATUS_MESSAGE = {
  new: "A new catalog access request has been submitted.",
  approved: "The catalog access request has been approved.",
  rejected: "The catalog access request has been declined.",
  revoked: "Catalog access has been revoked.",
}

export const CatalogAccessAdminEmail = ({
  name,
  company,
  companyType,
  email,
  phone,
  message,
  status = "new",
}: CatalogAccessAdminEmailProps) => {
  return (
    <EmailLayout heading="Catalog Access Request" template="admin">
      <Section className="px-6 pt-3 pb-7 sm:px-8">
        <Text className="mb-3 text-base font-semibold text-text">
          Hello Team,
        </Text>

        <Text className="text-sm leading-6">
          {STATUS_MESSAGE[status as keyof typeof STATUS_MESSAGE] ??
            "A catalog access request has been updated."}
        </Text>

        <Section className="bg-details mt-5 rounded-lg border border-border px-5 py-1">
          <Text className="text-text text-sm font-semibold">
            Request Details
          </Text>

          <Text className="my-0 font-semibold">Name:</Text>
          <Text className="mt-0 text-secondary">{name || "N/A"}</Text>

          <Text className="my-0 font-semibold">Company:</Text>
          <Text className="mt-0 text-secondary">{company || "N/A"}</Text>

          <Text className="my-0 font-semibold">Business Type:</Text>
          <Text className="mt-0 text-secondary">{companyType || "N/A"}</Text>

          <Text className="my-0 font-semibold">Email:</Text>
          <Text className="mt-0 text-secondary">{email || "N/A"}</Text>

          <Text className="my-0 font-semibold">Phone:</Text>
          <Text className="mt-0 text-secondary">{phone || "N/A"}</Text>
        </Section>

        {message && (
          <Section className="bg-details mt-5 rounded-lg border border-border px-5 py-1">
            <Text className="text-text text-sm font-semibold">Message:</Text>
            <Text className="text-sm leading-6">{message}</Text>
          </Section>
        )}
      </Section>
    </EmailLayout>
  )
}

CatalogAccessAdminEmail.PreviewProps = {
  name: "Alex Morgan",
  company: "Example Market",
  companyType: "Restaurant",
  email: "alex@example.com",
  phone: "555-0101",
  message: "I would like access to the product catalog.",
  status: "new",
} satisfies Parameters<typeof CatalogAccessAdminEmail>[0]

export default CatalogAccessAdminEmail
