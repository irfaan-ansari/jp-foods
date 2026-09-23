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
      <Section className="px-6 pt-3 pb-7 sm:px-8">
        <Text className="mb-3 text-base font-semibold text-text">
          Hello {name || "Name"},
        </Text>

        <Text className="text-sm leading-6">
          Thank you for your interest in opening an account with Jimenez
          Produce.
          <br />
          After reviewing your application, we regret to inform you that we are
          unable to approve your account at this time.
        </Text>

        <Section className="bg-details mt-5 rounded-lg border border-border px-5 py-1">
          <Text className="text-text text-sm font-semibold">
            Reason: {reason}
          </Text>
          <Text className="text-sm leading-6">{reasonDetails}</Text>
        </Section>

        <Text className="text-sm leading-6">
          If you believe additional information may assist in reconsideration,
          please reply to this email or contact our office.
        </Text>
        <Text className="font-semibold">
          We appreciate your interest and wish you continued success.
        </Text>
      </Section>
    </EmailLayout>
  )
}

CustomerApplicationDeclinedEmail.PreviewProps = {
  name: "Alex Morgan",
  company: "Example Market",
  reason: "Service area",
  reasonDetails:
    "The requested delivery address is outside our current service area.",
} satisfies Parameters<typeof CustomerApplicationDeclinedEmail>[0]

export default CustomerApplicationDeclinedEmail
