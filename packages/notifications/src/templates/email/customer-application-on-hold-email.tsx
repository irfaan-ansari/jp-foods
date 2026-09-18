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
      <Section className="p-6">
        <Text className="mb-2 text-xl font-semibold text-black">
          Hello {name || "Name"},
        </Text>

        <Text className="text-lg">
          Thank you for your interest in opening an account with Jimenez
          Produce.
          <br />
          Your application is currently on hold pending additional information.
        </Text>

        <Section className="border-email-border border p-6">
          <Text className="text-email-brand text-lg font-semibold uppercase">
            Reason: {reason}
          </Text>
          <Text className="text-lg">{reasonDetails}</Text>
        </Section>

        <Text className="text-lg">
          Once received, applications are typically processed within 24–48
          business hours.
          <br />
          If you have any questions, please contact our accounts department.
        </Text>
        <Text className="text-lg font-semibold">
          We look forward to completing your application.
        </Text>
      </Section>
    </EmailLayout>
  )
}
