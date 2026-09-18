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
      <Section className="p-6">
        <Text className="mb-2 text-xl font-semibold text-black">
          Hello {name || "Name"},
        </Text>

        {status === "approved" && (
          <Text className="text-lg">
            We are pleased to inform you that your catalog access request for{" "}
            <strong>{company || "Company"}</strong> has been approved.
            <br />
            <br />
            You may now access our product catalog, including available items
            and related information.
          </Text>
        )}
        {status === "rejected" && (
          <Text className="text-lg">
            Thank you for your interest with Jimenez Produce.
            <br />
            <br />
            After reviewing your application, we are unable to approve your
            catalog access request at this time.
          </Text>
        )}
        {status === "revoked" && (
          <Text className="text-lg">
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
            className="bg-email-brand mb-4 rounded-lg p-4 text-center text-sm font-semibold text-white uppercase"
          >
            View Products
          </Button>
        )}

        {reason && (
          <Section className="border-email-border mt-4 border p-6">
            <Text className="text-email-brand text-lg font-semibold uppercase">
              Reason: {reason}
            </Text>

            {message && <Text className="text-lg">{message}</Text>}
          </Section>
        )}

        <Section className="border-email-border mt-4 border p-6">
          <Text className="text-email-brand text-lg font-semibold uppercase">
            Need Assistance?
          </Text>

          <Text className="text-lg">
            If you have any questions regarding catalog access, please contact
            our support team for further assistance.
          </Text>
        </Section>
      </Section>
    </EmailLayout>
  )
}
