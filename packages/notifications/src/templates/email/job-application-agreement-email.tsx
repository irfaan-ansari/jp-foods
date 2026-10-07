import { Button, Section, Text } from "react-email"

import { EmailLayout } from "./email-layout"

interface JobApplicationAgreementEmailProps {
  name: string
  position: string
  agreementUrl: string
}

export const JobApplicationAgreementEmail = ({
  name,
  position,
  agreementUrl,
}: JobApplicationAgreementEmailProps) => {
  return (
    <EmailLayout
      heading="Employment Agreement"
      preview={`Employment agreement for ${position} | Jimenez Produce`}
      template="customer"
    >
      <Section className="px-6 pt-3 pb-7 sm:px-8">
        <Text className="mb-3 text-base font-semibold text-text">
          Hello {name || "Applicant"},
        </Text>

        <Text className="text-sm leading-6">
          Your employment agreement for the <strong>{position}</strong> position
          with Jimenez Produce is ready for review.
        </Text>

        <Text className="mt-4 text-sm leading-6">
          Please review the agreement carefully and submit your acknowledgment to
          continue the hiring process.
        </Text>

        <Button
          href={agreementUrl}
          className="bg-brand my-5 inline-block rounded-md px-5 py-3 text-sm font-semibold text-white no-underline"
        >
          Review Agreement
        </Button>

        <Text className="text-sm text-muted">
          If the button does not work, copy and paste this link into your
          browser: {agreementUrl}
        </Text>
      </Section>
    </EmailLayout>
  )
}

JobApplicationAgreementEmail.PreviewProps = {
  name: "Alex Morgan",
  position: "Delivery Driver",
  agreementUrl: "https://jimenezproduce.com/careers/agreement?token=preview",
} satisfies Parameters<typeof JobApplicationAgreementEmail>[0]

export default JobApplicationAgreementEmail
