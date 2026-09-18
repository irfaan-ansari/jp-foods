import { EmailLayout } from "./email-layout"
import { Section, Text, Button } from "react-email"

interface CustomerApplicationApprovedEmailProps {
  name: string
  company: string
  portalUrl?: string
}

export const CustomerApplicationApprovedEmail = ({
  name,
  company,
  portalUrl,
}: CustomerApplicationApprovedEmailProps) => {
  return (
    <EmailLayout template="customer" heading="Application Approved">
      <Section className="p-6">
        <Text className="mb-2 text-xl font-semibold text-black">
          Hello {name || "Name"},
        </Text>

        <Text className="text-lg">
          We are pleased to inform you that your account application for{" "}
          <span className="inline-block font-semibold uppercase">
            {company || "Company"}
          </span>{" "}
          has been approved.
        </Text>

        <Text className="mt-8 mb-0 text-xl font-semibold">
          Your account is now active in our system.
        </Text>

        <Section className="border-email-border mt-6 border p-6">
          <Text className="text-email-brand text-lg font-semibold uppercase">
            Ordering Information
          </Text>
          <Text className="text-lg">
            <strong>*</strong> Orders must be placed the day before delivery
            <br />
            <strong>*</strong> Daily cutoff time: 3:00 PM
            <br />
            <strong>*</strong> Deliveries are made the following scheduled
            delivery day
            <br />
            <strong>*</strong> Orders placed after 3:00 PM will move to the next
            available delivery date
          </Text>
        </Section>

        <Section className="border-email-border mt-6 border p-6">
          <Text className="text-email-brand text-lg font-semibold uppercase">
            You may now begin placing orders through:
          </Text>
          <Text className="text-lg">
            <strong>*</strong> Your assigned sales representative
            <br />
            <strong>*</strong> Our online ordering portal
          </Text>

          {portalUrl && (
            <Button
              href={portalUrl}
              className="bg-email-brand p-4 text-center text-sm font-semibold text-white"
            >
              Open Ordering Portal
            </Button>
          )}
        </Section>

        <Text className="text-lg">
          If you have any questions regarding pricing, delivery schedule, or
          product availability, please contact our team.
        </Text>
        <Text className="text-lg font-semibold">
          We look forward to serving your business.
        </Text>
      </Section>
    </EmailLayout>
  )
}
