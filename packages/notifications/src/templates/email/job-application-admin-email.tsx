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
      <Section className="p-6">
        <Text className="mb-2 text-xl font-semibold text-black">
          Hello Team,
        </Text>

        <Text className="text-email-secondary text-lg">
          {STATUS_MESSAGE[status as keyof typeof STATUS_MESSAGE] ??
            "A job application has been updated."}
        </Text>

        <Section className="border-email-border mt-6 border p-6">
          <Text className="mb-1 text-base">
            <strong>Name:</strong> {name}
          </Text>
          <Text className="mb-1 text-base">
            <strong>Position:</strong> {position}
          </Text>
          <Text className="mb-1 text-base">
            <strong>Facility:</strong> {location}
          </Text>
          <Text className="mb-1 text-base">
            <strong>Contact Details:</strong> {email} | {phone}
          </Text>
        </Section>

        {/* Dynamic Update Section */}
        {(statusReason || statusDetails || internalNotes) && (
          <Section className="border-email-brand bg-email-details mt-6 border-l-4 p-6">
            <Text className="text-email-brand mt-0 mb-2 text-xs font-bold uppercase">
              Current Stage: {status.toUpperCase()}
            </Text>

            {statusReason && <Text> Reason: {statusReason}</Text>}
            {statusDetails && (
              <Text className="mt-0 mb-2 text-base text-black italic">
                "{statusDetails}"
              </Text>
            )}

            {internalNotes && (
              <>
                <Text className="mt-4 mb-1 text-xs font-bold text-gray-400 uppercase">
                  Internal Notes:
                </Text>
                <Text className="text-email-secondary mt-0 text-sm">
                  {internalNotes}
                </Text>
              </>
            )}
          </Section>
        )}
      </Section>
    </EmailLayout>
  )
}
