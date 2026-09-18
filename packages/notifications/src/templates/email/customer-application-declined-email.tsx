import { Section, Text } from "react-email"

import { EmailLayout } from "./email-layout"

interface CustomerApplicationDeclinedEmailProps {
  name: string
  company: string
  reason: string
  reasonDetails: string
}

export const CustomerApplicationDeclinedEmail = ({
  name,
  reason,
  reasonDetails,
}: CustomerApplicationDeclinedEmailProps) => {
  return (
    <EmailLayout template="customer" heading="Application Declined">
      <Section className="p-6">
        <Text className="mb-2 text-xl font-semibold text-black">
          Hello {name || "Name"},
        </Text>

        <Text className="text-lg">
          Thank you for your interest in opening an account with Jimenez
          Produce.
          <br />
          After reviewing your application, we regret to inform you that we are
          unable to approve your account at this time.
        </Text>

        <Section className="border-email-border border p-6">
          <Text className="text-email-brand text-lg font-semibold uppercase">
            Reason: {reason}
          </Text>
          <Text className="text-lg">{reasonDetails}</Text>
        </Section>

        <Text className="text-lg">
          If you believe additional information may assist in reconsideration,
          please reply to this email or contact our office.
        </Text>
        <Text className="text-lg font-semibold">
          We appreciate your interest and wish you continued success.
        </Text>
      </Section>
    </EmailLayout>
  )
}
