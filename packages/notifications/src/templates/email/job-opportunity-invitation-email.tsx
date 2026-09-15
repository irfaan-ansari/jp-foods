import { EmailLayout } from "./email-layout"
import { Section, Text, Button, Heading } from "react-email"

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
      <Section className="p-8">
        <Heading className="mb-4 text-2xl font-bold text-black">
          New Career Opportunity: {position}
        </Heading>

        <Heading className="mb-6 text-xl font-bold text-black">
          Hi {name},
        </Heading>

        <Text className="mb-6 text-lg leading-relaxed">
          We’re currently looking for a <strong>{position}</strong> to join our
          team at <strong>Jimenez Produce</strong>, and your profile caught my
          eye.
        </Text>

        <Text className="mb-6 text-lg leading-relaxed">
          We’re specifically looking for someone who takes pride in their work
          and wants to play a key role in a fast-growing environment. Based on
          your experience, I think you’d be a great fit for the culture we’re
          building here.
        </Text>

        <Text className="mb-10 text-lg font-semibold">
          Would you be open to taking a look at the role?
        </Text>

        <Button
          href={`https://jimenezproduce.com/careers/${positionSlug}`}
          className="bg-email-brand flex justify-center px-8 py-4 font-bold text-white uppercase no-underline"
        >
          Apply Now
        </Button>
        <Text className="mt-6 text-sm text-gray-400">
          If you're not looking right now, feel free to pass this along to
          someone in your network!
        </Text>
      </Section>
    </EmailLayout>
  )
}
