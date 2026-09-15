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
      <Section className="p-6">
        <Text className="mb-2 text-xl font-semibold text-black">
          Hello {name || "there"},
        </Text>

        <Text className="text-lg">
          We have received a catalog access request for{" "}
          <strong>{company}</strong>. Our team is currently reviewing your
          submission.
        </Text>

        {message && <Text className="text-lg italic">“{message}”</Text>}

        <Section className="mt-4 p-6 shadow-sm">
          <Text className="text-email-brand text-lg font-semibold uppercase">
            Need Assistance?
          </Text>

          <Text className="text-lg">
            If you have any questions regarding your catalog access status,
            please contact our support team for further assistance.
          </Text>
        </Section>

        <Text className="text-lg">
          We distribute produce, dairy, dry goods, beverages, and specialty
          foodservice products throughout the Gulf Coast region.
        </Text>
        <Text className="text-lg font-semibold">
          We look forward to reviewing your application.
        </Text>
      </Section>
    </EmailLayout>
  )
}
