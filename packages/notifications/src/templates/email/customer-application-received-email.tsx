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
      <Section className="p-6">
        <Text className="mb-2 text-xl font-semibold text-black">
          Hello {name || "Name"},
        </Text>

        <Text className="text-lg">
          Thank you for submitting your account application with{" "}
          <strong>Jimenez Produce</strong>, your trusted food service
          distributor.
        </Text>

        <Text className="mb-0 text-lg">
          Our Customer Accounts Department has received your application and
          will review it within 24–48 business hours.
        </Text>

        <Section className="border-email-border mt-6 border p-6">
          <Text className="text-email-brand mt-0 text-lg font-semibold uppercase">
            Next steps:
          </Text>

          <Text className="mb-0 text-base font-semibold">
            • Our team reviews your submitted documentation. <br />
            • Once approved, you will receive a confirmation email. <br />•
            After approval, you can start placing orders.
          </Text>
        </Section>
        <Section className="border-email-border mt-6 border p-6">
          <Text className="text-email-brand text-lg font-semibold uppercase">
            Ordering & Delivery:
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
