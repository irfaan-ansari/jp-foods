import { EmailLayout } from "./email-layout"
import { Section, Text } from "react-email"

interface JobApplicationDeclinedEmailProps {
  name: string
  position: string
  reason: string
  detailedReason: string
}

export const JobApplicationDeclinedEmail = ({
  name,
  position,
  reason,
  detailedReason,
}: JobApplicationDeclinedEmailProps) => {
  return (
    <EmailLayout template="customer" heading="Application Status Update">
      <Section className="px-6 pt-3 pb-7 sm:px-8">
        <Text className="mb-3 text-base font-semibold text-text">
          Hello {name || "Applicant"},
        </Text>

        <Text className="text-sm leading-6">
          Thank you for your interest in the
          <span className="mx-1 inline-block font-semibold uppercase">
            {position}
          </span>
          position with Jimenez Produce.
        </Text>

        <Text className="mt-4">
          After careful consideration, we regret to inform you that we will not
          be moving forward with your application at this time.
        </Text>

        <Section className="bg-details mt-5 rounded-lg border border-border px-5 py-1">
          <Text className="text-text text-sm font-semibold">
            Application Review Summary
          </Text>

          <Text className="font-semibold">Reason:</Text>
          <Text className="text-sm leading-6">{reason}</Text>

          {detailedReason && <Text className="text-sm leading-6">{detailedReason}</Text>}
        </Section>

        <Text className="mt-6">
          We sincerely appreciate the time and effort you invested in your
          application. We encourage you to apply for future opportunities that
          align with your qualifications and experience.
        </Text>

        <Text className="mt-6 font-semibold">
          We wish you continued success in your professional endeavors.
        </Text>
      </Section>
    </EmailLayout>
  )
}

JobApplicationDeclinedEmail.PreviewProps = {
  name: "Alex Morgan",
  position: "Delivery Driver",
  reason: "Position filled",
  detailedReason: "We have selected another candidate for this position.",
} satisfies Parameters<typeof JobApplicationDeclinedEmail>[0]

export default JobApplicationDeclinedEmail
