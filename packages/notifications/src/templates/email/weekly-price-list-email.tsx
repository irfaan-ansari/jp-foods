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
      <Section className="px-6 pt-3 pb-7 sm:px-8">
        <Text className="mb-3 text-base font-semibold text-text">
          Hello {name || "there"},
        </Text>

        <Text className="mb-6">
          Thank you for choosing Jimenez Produce.
          <br />
          Our latest weekly price list is now available. Click the button below
          to view this week's products and pricing.
        </Text>

        <Section className="my-8 text-left">
          <Button
            href={pdfUrl}
            className="bg-brand my-4 inline-block rounded-md px-5 py-3 text-sm font-semibold text-white no-underline"
          >
            View Price List
          </Button>

          {digitalUrl && (
            <Text className="mt-4 mb-0 text-sm">
              Prefer browsing online?{" "}
              <Button
                href={digitalUrl}
                className="text-brand font-semibold underline"
              >
                View the digital catalog
              </Button>
            </Text>
          )}
        </Section>

        <Text className="mt-6 text-secondary">
          If you have any questions or would like to place an order, simply
          reach out to us on WhatsApp or contact us using the email address or
          phone number listed below.
        </Text>
        <Text className="mt-6 text-secondary">
          Thank you for choosing Jimenez Produce!
        </Text>
      </Section>
    </EmailLayout>
  )
}

WeeklyPriceListEmail.PreviewProps = {
  name: "Alex Morgan",
  pdfUrl: "https://example.com/weekly-price-list.pdf",
  digitalUrl: "https://example.com/catalog",
} satisfies Parameters<typeof WeeklyPriceListEmail>[0]

export default WeeklyPriceListEmail
