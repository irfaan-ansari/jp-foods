import { EmailLayout } from "./email-layout"
import { Section, Text } from "react-email"

interface CatalogAccessRequestReceivedEmailProps {
  name: string
  company: string
  message: string
}

export const CatalogAccessRequestReceivedEmail = ({
  name,
  message,
  company,
}: CatalogAccessRequestReceivedEmailProps) => {
  return (
    <EmailLayout template="customer" heading="Request Submitted">
      <Section className="px-6 pt-3 pb-7 sm:px-8">
        <Text className="mb-3 text-base font-semibold text-text">
          Hello {name || "there"},
        </Text>

        <Text className="text-sm leading-6">
          We have received a catalog access request for{" "}
          <strong>{company}</strong>. Our team is currently reviewing your
          submission.
        </Text>

        {message && <Text className="italic">“{message}”</Text>}

        <Section className="bg-details mt-5 rounded-lg border border-border px-5 py-1">
          <Text className="text-text text-sm font-semibold">
            Need Assistance?
          </Text>

          <Text className="text-sm leading-6">
            If you have any questions regarding your catalog access status,
            please contact our support team for further assistance.
          </Text>
        </Section>

        <Text className="text-sm leading-6">
          We distribute produce, dairy, dry goods, beverages, and specialty
          foodservice products throughout the Gulf Coast region.
        </Text>
        <Text className="font-semibold">
          We look forward to reviewing your application.
        </Text>
      </Section>
    </EmailLayout>
  )
}

CatalogAccessRequestReceivedEmail.PreviewProps = {
  name: "Alex Morgan",
  company: "Example Market",
  message: "I would like access to the product catalog.",
} satisfies Parameters<typeof CatalogAccessRequestReceivedEmail>[0]

export default CatalogAccessRequestReceivedEmail
