import { Section, Text } from "react-email"

import { EmailLayout } from "./email-layout"

interface CustomerApplicationReceivedEmailProps {
  name: string
  company: string
}

export const CustomerApplicationReceivedEmail = ({
  name,
  company,
}: CustomerApplicationReceivedEmailProps) => {
  return (
    <EmailLayout template="customer" heading="Application Submitted">
      <Section className="px-6 pt-3 pb-7 sm:px-8">
        <Text className="mb-3 text-base font-semibold text-text">
          Hello {name || "Name"},
        </Text>

        <Text className="text-sm leading-6">
          Thank you for submitting your account application with{" "}
          <strong>Jimenez Produce</strong>, your trusted food service
          distributor.
        </Text>

        <Text className="mb-0">
          Our Customer Accounts Department has received your application and
          will review it within 24–48 business hours.
        </Text>

        <Section className="bg-details mt-5 rounded-lg border border-border px-5 py-1">
          <Text className="text-text text-sm font-semibold">
            Next steps:
          </Text>

          <Text className="mb-0 font-semibold">
            • Our team reviews your submitted documentation. <br />
            • Once approved, you will receive a confirmation email. <br />•
            After approval, you can start placing orders.
          </Text>
        </Section>
        <Section className="bg-details mt-5 rounded-lg border border-border px-5 py-1">
          <Text className="text-text text-sm font-semibold">
            Ordering & Delivery:
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

CustomerApplicationReceivedEmail.PreviewProps = {
  name: "Alex Morgan",
  company: "Example Market",
} satisfies Parameters<typeof CustomerApplicationReceivedEmail>[0]

export default CustomerApplicationReceivedEmail
