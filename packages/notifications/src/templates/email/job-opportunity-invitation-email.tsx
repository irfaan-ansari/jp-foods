import { EmailLayout } from "./email-layout"
import { Section, Text, Button } from "react-email"

interface JobOpportunityInvitationEmailProps {
  name: string
  position: string
  positionSlug: string
}

export const JobOpportunityInvitationEmail = ({
  name,
  position,
  positionSlug,
}: JobOpportunityInvitationEmailProps) => {
  return (
    <EmailLayout heading="Join Our Team" template="customer">
      <Section className="px-6 pt-3 pb-7 sm:px-8">
        <Text className="mb-3 text-base font-semibold text-text">
          Hi {name},
        </Text>

        <Text className="mb-6">
          We’re currently looking for a <strong>{position}</strong> to join our
          team at <strong>Jimenez Produce</strong>, and your profile caught my
          eye.
        </Text>

        <Text className="mb-6">
          We’re specifically looking for someone who takes pride in their work
          and wants to play a key role in a fast-growing environment. Based on
          your experience, I think you’d be a great fit for the culture we’re
          building here.
        </Text>

        <Section className="bg-details mt-5 rounded-lg border border-border px-5 py-1">
          <Text className="text-text text-sm font-semibold">
            New Career Opportunity: {position}
          </Text>
          <Text className="font-semibold">
            Would you be open to taking a look at the role?
          </Text>

          <Button
            href={`https://jimenezproduce.com/careers/${positionSlug}`}
            className="bg-brand my-4 inline-block rounded-md px-5 py-3 text-sm font-semibold text-white no-underline"
          >
            Apply Now
          </Button>
        </Section>
        <Text className="mt-6 text-sm text-muted">
          If you're not looking right now, feel free to pass this along to
          someone in your network!
        </Text>
      </Section>
    </EmailLayout>
  )
}

JobOpportunityInvitationEmail.PreviewProps = {
  name: "Alex Morgan",
  position: "Delivery Driver",
  positionSlug: "delivery-driver",
} satisfies Parameters<typeof JobOpportunityInvitationEmail>[0]

export default JobOpportunityInvitationEmail
