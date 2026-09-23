import { Section, Text } from "react-email"

import { EmailLayout } from "./email-layout"

interface CustomerApplicationOnHoldEmailProps {
  name: string
  reason: string
  reasonDetails: string
}

export const CustomerApplicationOnHoldEmail = ({
  name,
  reason,
  reasonDetails,
}: CustomerApplicationOnHoldEmailProps) => {
  return (
    <EmailLayout template="customer" heading="Application On-Hold">
      <Section className="px-6 pt-3 pb-7 sm:px-8">
        <Text className="mb-3 text-base font-semibold text-text">
          Hello {name || "Name"},
        </Text>

        <Text className="text-sm leading-6">
          Thank you for your interest in opening an account with Jimenez
          Produce.
          <br />
          Your application is currently on hold pending additional information.
        </Text>

        <Section className="bg-details mt-5 rounded-lg border border-border px-5 py-1">
          <Text className="text-text text-sm font-semibold">
            Reason: {reason}
          </Text>
          <Text className="text-sm leading-6">{reasonDetails}</Text>
        </Section>

        <Text className="text-sm leading-6">
          Once received, applications are typically processed within 24–48
          business hours.
          <br />
          If you have any questions, please contact our accounts department.
        </Text>
        <Text className="font-semibold">
          We look forward to completing your application.
        </Text>
      </Section>
    </EmailLayout>
  )
}

CustomerApplicationOnHoldEmail.PreviewProps = {
  name: "Alex Morgan",
  reason: "Additional information needed",
  reasonDetails: "Please provide your business registration details.",
} satisfies Parameters<typeof CustomerApplicationOnHoldEmail>[0]

export default CustomerApplicationOnHoldEmail
