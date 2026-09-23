import { EmailLayout } from "./email-layout"
import { Section, Text } from "react-email"

interface JobApplicationReceivedEmailProps {
  name: string
  position: string
}

export const JobApplicationReceivedEmail = ({
  name,
  position,
}: JobApplicationReceivedEmailProps) => {
  return (
    <EmailLayout template="customer" heading="Application Received">
      <Section className="px-6 pt-3 pb-7 sm:px-8">
        <Text className="mb-3 text-base font-semibold text-text">
          Hello {name || "Applicant"},
        </Text>

        <Text className="text-sm leading-6">
          Thank you for applying for the{" "}
          <span className="inline-block font-semibold uppercase">
            {position}
          </span>{" "}
          position with Jimenez Produce.
        </Text>

        <Text className="mt-4">
          We have successfully received your application, and our team will
          carefully review your qualifications and submitted documents.
        </Text>

        <Section className="bg-details mt-5 rounded-lg border border-border px-5 py-1">
          <Text className="text-text text-sm font-semibold">
            What Happens Next
          </Text>

          <Text className="text-sm leading-6">
            <strong>*</strong> Our Human Resources team will evaluate your
            experience and credentials
            <br />
            <strong>*</strong> Qualified candidates will be contacted for the
            next step in the hiring process
            <br />
            <strong>*</strong> Please ensure your contact information remains up
            to date
          </Text>
        </Section>

        <Text className="mt-6">
          We sincerely appreciate your interest in joining our team and look
          forward to reviewing your application.
        </Text>
      </Section>
    </EmailLayout>
  )
}

JobApplicationReceivedEmail.PreviewProps = {
  name: "Alex Morgan",
  position: "Delivery Driver",
} satisfies Parameters<typeof JobApplicationReceivedEmail>[0]

export default JobApplicationReceivedEmail
