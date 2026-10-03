import { Section, Text } from "react-email"
import { EmailLayout } from "./email-layout"

interface CandidateBackgroundCheckRequestEmailProps {
  providerName?: string
  name: string
  position: string
  email: string
  phone: string
  reference: string
}

export const CandidateBackgroundCheckRequestEmail = ({
  providerName = "team",
  name,
  position,
  email,
  phone,
  reference,
}: CandidateBackgroundCheckRequestEmailProps) => {
  return (
    <EmailLayout
      heading="Candidate Background Check Request"
      preview={`Background check request for ${name} | Jimenez Produce`}
      template="customer"
    >
      <Section className="px-6 pt-3 pb-7 sm:px-8">
        <Text className="text-text mb-3 text-base font-semibold">
          Hello {providerName},
        </Text>
        <Text className="text-secondary">
          Please initiate the background screening process for the following
          candidate applying to Jimenez Produce.
        </Text>

        <Section className="bg-details mt-5 rounded-lg border border-border px-5 py-1">
          <Text className="text-text text-sm font-semibold">
            Candidate Details
          </Text>
          <Text className="mb-1">
            <strong>Reference:</strong> {reference}
          </Text>
          <Text className="mb-1">
            <strong>Name:</strong> {name}
          </Text>
          <Text className="mb-1">
            <strong>Position:</strong> {position}
          </Text>
          <Text className="mb-1">
            <strong>Email:</strong> {email}
          </Text>
          <Text className="text-sm leading-6">
            <strong>Phone:</strong> {phone}
          </Text>
        </Section>

        <Text className="mt-5 text-secondary">
          Please confirm receipt and share the expected turnaround time. Let us
          know which candidate authorization or additional information you need
          before proceeding, along with a secure way to provide it.
        </Text>
        <Text className="text-secondary">
          Please reference {reference} in your updates and provide the completed
          report through your secure delivery process.
        </Text>
        <Text className="mt-6 text-sm text-muted">
          Thank you,
          <br />
          Jimenez Produce Hiring Team
        </Text>
      </Section>
    </EmailLayout>
  )
}

CandidateBackgroundCheckRequestEmail.PreviewProps = {
  providerName: "team",
  name: "Alex Morgan",
  position: "Delivery Driver",
  email: "alex@example.com",
  phone: "555-0101",
  reference: "CAND-000123",
} satisfies Parameters<typeof CandidateBackgroundCheckRequestEmail>[0]

export default CandidateBackgroundCheckRequestEmail
