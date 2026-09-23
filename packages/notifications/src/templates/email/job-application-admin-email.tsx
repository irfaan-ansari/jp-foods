import { EmailLayout } from "./email-layout"
import { Section, Text } from "react-email"

interface JobApplicationAdminEmailProps {
  name: string
  position: string
  location: string
  email: string
  phone: string
  status: string
  statusReason?: string
  statusDetails?: string
  internalNotes?: string
}

const STATUS_MESSAGE = {
  new: "A new job application has been received.",
  interview: "The candidate has been moved to the Interview stage.",
  pending: "An agreement has been sent to the candidate.",
  hired: "Congratulations! The candidate has been officially hired.",
  rejected:
    "The application has been closed and the candidate was not selected.",
}

export const JobApplicationAdminEmail = ({
  name,
  position,
  location,
  email,
  phone,
  status = "new",
  statusReason,
  statusDetails,
  internalNotes,
}: JobApplicationAdminEmailProps) => {
  return (
    <EmailLayout heading="Job Application Update" template="admin">
      <Section className="px-6 pt-3 pb-7 sm:px-8">
        <Text className="mb-3 text-base font-semibold text-text">
          Hello Team,
        </Text>

        <Text className="text-secondary">
          {STATUS_MESSAGE[status as keyof typeof STATUS_MESSAGE] ??
            "A job application has been updated."}
        </Text>

        <Section className="bg-details mt-5 rounded-lg border border-border px-5 py-1">
          <Text className="text-text text-sm font-semibold">
            Applicant Details
          </Text>
          <Text className="mb-1">
            <strong>Name:</strong> {name}
          </Text>
          <Text className="mb-1">
            <strong>Position:</strong> {position}
          </Text>
          <Text className="mb-1">
            <strong>Facility:</strong> {location}
          </Text>
          <Text className="text-sm leading-6">
            <strong>Contact Details:</strong> {email} | {phone}
          </Text>
        </Section>

        {/* Dynamic Update Section */}
        {(statusReason || statusDetails || internalNotes) && (
          <Section className="bg-details mt-5 rounded-lg border border-border px-5 py-1">
            <Text className="text-text text-sm font-semibold">
              Current Stage: {status.toUpperCase()}
            </Text>

            {statusReason && <Text className="text-sm leading-6"> Reason: {statusReason}</Text>}
            {statusDetails && (
              <Text className="mt-0 mb-2 text-black italic">
                "{statusDetails}"
              </Text>
            )}

            {internalNotes && (
              <>
                <Text className="font-semibold">Internal Notes:</Text>
                <Text className="text-sm leading-6">{internalNotes}</Text>
              </>
            )}
          </Section>
        )}
      </Section>
    </EmailLayout>
  )
}

JobApplicationAdminEmail.PreviewProps = {
  name: "Alex Morgan",
  position: "Delivery Driver",
  location: "Fort Smith, AR",
  email: "alex@example.com",
  phone: "555-0101",
  status: "new",
} satisfies Parameters<typeof JobApplicationAdminEmail>[0]

export default JobApplicationAdminEmail
