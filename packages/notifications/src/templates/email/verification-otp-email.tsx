import { Section, Text } from "react-email"
import { EmailLayout } from "./email-layout"

export const VerificationOtpEmail = ({ otp }: { otp: string }) => {
  return (
    <EmailLayout
      heading="Verification code"
      preview="Your one-time verification code for Jimenez Produce."
    >
      <Section className="px-6 pt-3 pb-7 sm:px-8">
        <Text className="text-sm leading-6">
          Use this one-time code to continue with your account update.
        </Text>
        <Text
          className="bg-details text-text rounded-lg border border-border px-5 py-5 text-center"
          style={{ fontSize: "32px", fontWeight: 700, letterSpacing: "8px" }}
        >
          {otp}
        </Text>
        <Text className="mt-6 text-sm leading-6">
          If you did not request this, you can safely ignore this email.
        </Text>
      </Section>
    </EmailLayout>
  )
}

VerificationOtpEmail.PreviewProps = {
  otp: "123456",
} satisfies Parameters<typeof VerificationOtpEmail>[0]

export default VerificationOtpEmail
