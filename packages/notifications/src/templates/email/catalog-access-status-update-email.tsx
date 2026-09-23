import { EmailLayout } from "./email-layout"
import { Button, Section, Text } from "react-email"

interface CatalogAccessStatusUpdateEmailProps {
  name: string
  message?: string
  company: string
  status: "approved" | "rejected" | "revoked"
  link?: string
  reason?: string
}

export const CatalogAccessStatusUpdateEmail = ({
  name,
  reason,
  message,
  company,
  status = "revoked",
  link,
}: CatalogAccessStatusUpdateEmailProps) => {
  return (
    <EmailLayout heading="Catalog Access Update">
      <Section className="px-6 pt-3 pb-7 sm:px-8">
        <Text className="mb-3 text-base font-semibold text-text">
          Hello {name || "Name"},
        </Text>

        {status === "approved" && (
          <Text className="text-sm leading-6">
            We are pleased to inform you that your catalog access request for{" "}
            <strong>{company || "Company"}</strong> has been approved.
            <br />
            <br />
            You may now access our product catalog, including available items
            and related information.
          </Text>
        )}
        {status === "rejected" && (
          <Text className="text-sm leading-6">
            Thank you for your interest with Jimenez Produce.
            <br />
            <br />
            After reviewing your application, we are unable to approve your
            catalog access request at this time.
          </Text>
        )}
        {status === "revoked" && (
          <Text className="text-sm leading-6">
            Your catalog access has been discontinued following a recent account
            review.
            <br />
            <br />
            This action may be based on internal credit evaluation,
            documentation requirements, service area limitations, or account
            policy considerations.
          </Text>
        )}

        {status === "approved" && link && (
          <Button
            href={link}
            target="_blank"
            className="bg-brand my-4 inline-block rounded-md px-5 py-3 text-sm font-semibold text-white no-underline"
          >
            View Products
          </Button>
        )}

        {reason && (
          <Section className="bg-details mt-5 rounded-lg border border-border px-5 py-1">
            <Text className="text-text text-sm font-semibold">
              Reason: {reason}
            </Text>

            {message && <Text className="text-sm leading-6">{message}</Text>}
          </Section>
        )}

        <Section className="bg-details mt-5 rounded-lg border border-border px-5 py-1">
          <Text className="text-text text-sm font-semibold">
            Need Assistance?
          </Text>

          <Text className="text-sm leading-6">
            If you have any questions regarding catalog access, please contact
            our support team for further assistance.
          </Text>
        </Section>
      </Section>
    </EmailLayout>
  )
}

CatalogAccessStatusUpdateEmail.PreviewProps = {
  name: "Alex Morgan",
  company: "Example Market",
  status: "approved",
  link: "https://example.com/catalog",
} satisfies Parameters<typeof CatalogAccessStatusUpdateEmail>[0]

export default CatalogAccessStatusUpdateEmail
