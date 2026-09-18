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
      <Section className="p-6">
        <Text className="mb-2 text-xl font-semibold text-black">
          Hello {name || "Applicant"},
        </Text>

        <Text className="text-lg">
          Thank you for applying for the{" "}
          <span className="inline-block font-semibold uppercase">
            {position}
          </span>{" "}
          position with Jimenez Produce.
        </Text>

        <Text className="mt-4 text-lg">
          We have successfully received your application, and our team will
          carefully review your qualifications and submitted documents.
        </Text>

        <Section className="border-email-border mt-6 border p-6">
          <Text className="text-email-brand text-lg font-semibold uppercase">
            What Happens Next
          </Text>

          <Text className="text-lg">
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

        <Text className="mt-6 text-lg">
          We sincerely appreciate your interest in joining our team and look
          forward to reviewing your application.
        </Text>
      </Section>
    </EmailLayout>
  )
}
