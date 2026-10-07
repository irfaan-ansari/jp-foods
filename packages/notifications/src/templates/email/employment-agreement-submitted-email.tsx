import { Link, Section, Text } from "react-email"
import { EmailLayout } from "./email-layout"

type Props = {
  name: string
  email: string
  position: string
  facility: string | null
  submittedAt: string
  agreementUrl: string
}

export const EmploymentAgreementSubmittedEmail = ({
  name,
  email,
  position,
  facility,
  submittedAt,
  agreementUrl,
}: Props) => (
  <EmailLayout
    heading="Employment Agreement Submitted"
    preview={`Agreement submitted by ${name}`}
    template="customer"
  >
    <Section className="px-6 pt-3 pb-7 sm:px-8">
      <Text>{name} has acknowledged the employment terms and policies.</Text>
      <Text>
        <strong>Email:</strong> {email}
      </Text>
      <Text>
        <strong>Position:</strong> {position}
      </Text>
      <Text>
        <strong>Facility:</strong> {facility || "Not provided"}
      </Text>
      <Text>
        <strong>Submitted:</strong> {new Date(submittedAt).toUTCString()}
      </Text>
      <Link href={agreementUrl}>View signed employment agreement</Link>
    </Section>
  </EmailLayout>
)
