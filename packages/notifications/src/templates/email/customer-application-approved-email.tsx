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
      <Section className="px-6 pt-3 pb-7 sm:px-8">
        <Text className="mb-3 text-base font-semibold text-text">
          Hello {name || "Name"},
        </Text>

        <Text className="text-sm leading-6">
          We are pleased to inform you that your account application for{" "}
          <span className="inline-block font-semibold uppercase">
            {company || "Company"}
          </span>{" "}
          has been approved.
        </Text>

        <Text className="mt-6 font-semibold">
          Your account is now active in our system.
        </Text>

        <Section className="bg-details mt-5 rounded-lg border border-border px-5 py-1">
          <Text className="text-text text-sm font-semibold">
            Ordering Information
          </Text>
          <Text className="text-sm leading-6">
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

        <Section className="bg-details mt-5 rounded-lg border border-border px-5 py-1">
          <Text className="text-text text-sm font-semibold">
            You may now begin placing orders through:
          </Text>
          <Text className="text-sm leading-6">
            <strong>*</strong> Your assigned sales representative
            <br />
            <strong>*</strong> Our online ordering portal
          </Text>

          {portalUrl && (
            <Button
              href={portalUrl}
              className="bg-brand my-4 inline-block rounded-md px-5 py-3 text-sm font-semibold text-white no-underline"
            >
              Open Ordering Portal
            </Button>
          )}
        </Section>

        <Text className="text-sm leading-6">
          If you have any questions regarding pricing, delivery schedule, or
          product availability, please contact our team.
        </Text>
        <Text className="font-semibold">
          We look forward to serving your business.
        </Text>
      </Section>
    </EmailLayout>
  )
}

CustomerApplicationApprovedEmail.PreviewProps = {
  name: "Alex Morgan",
  company: "Example Market",
  portalUrl: "https://example.com/portal",
} satisfies Parameters<typeof CustomerApplicationApprovedEmail>[0]

export default CustomerApplicationApprovedEmail
