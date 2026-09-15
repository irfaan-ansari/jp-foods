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
      <Section className="p-6">
        <Text className="mb-2 text-xl font-semibold text-black">
          Hello {name || "Applicant"},
        </Text>

        <Text className="text-lg">
          Thank you for your interest in the{" "}
          <span className="inline-block font-semibold uppercase">
            {position}
          </span>{" "}
          position with Jimenez Produce.
        </Text>

        <Text className="mt-4 text-lg">
          After careful consideration, we regret to inform you that we will not
          be moving forward with your application at this time.
        </Text>

        <Section className="border-email-border mt-6 border p-6">
          <Text className="text-email-brand text-lg font-semibold uppercase">
            Application Review Summary
          </Text>

          <Text className="mt-2 text-lg font-semibold">Reason:</Text>
          <Text className="mt-1 text-lg">{reason}</Text>

          {detailedReason && (
            <Text className="mt-1 text-lg">{detailedReason}</Text>
          )}
        </Section>

        <Text className="mt-6 text-lg">
          We sincerely appreciate the time and effort you invested in your
          application. We encourage you to apply for future opportunities that
          align with your qualifications and experience.
        </Text>

        <Text className="mt-6 text-lg font-semibold">
          We wish you continued success in your professional endeavors.
        </Text>
      </Section>
    </EmailLayout>
  )
}
