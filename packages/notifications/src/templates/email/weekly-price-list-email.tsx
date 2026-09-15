import { Button, Section, Text } from "react-email"

import { EmailLayout } from "./email-layout"

interface WeeklyPriceListEmailProps {
  name?: string
  pdfUrl: string
  digitalUrl?: string
}

export const WeeklyPriceListEmail = ({
  name,
  pdfUrl,
  digitalUrl,
}: WeeklyPriceListEmailProps) => {
  return (
    <EmailLayout template="customer" heading="Weekly Price List">
      <Section className="p-6">
        <Text className="mb-2 text-xl font-semibold text-black">
          Hello {name || "there"},
        </Text>

        <Text className="mb-6 text-base">
          Thank you for choosing Jimenez Produce.
          <br />
          Our latest weekly price list is now available. Click the button below
          to view this week's products and pricing.
        </Text>

        <Section className="my-8 text-left">
          <Button
            href={pdfUrl}
            className="bg-email-brand inline-block rounded-lg px-6 py-4 text-base font-semibold text-white no-underline"
          >
            View Price List
          </Button>

          {digitalUrl && (
            <Text className="mt-4 mb-0 text-sm">
              Prefer browsing online?{" "}
              <Button
                href={digitalUrl}
                className="text-email-brand font-semibold underline"
              >
                View the digital catalog
              </Button>
            </Text>
          )}
        </Section>

        <Text className="mt-6 text-base text-gray-700">
          If you have any questions or would like to place an order, simply
          reach out to us on WhatsApp or contact us using the email address or
          phone number listed below.
        </Text>
        <Text className="mt-6 text-base text-gray-700">
          Thank you for choosing Jimenez Produce!
        </Text>
      </Section>
    </EmailLayout>
  )
}
