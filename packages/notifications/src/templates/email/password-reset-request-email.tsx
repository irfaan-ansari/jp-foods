import { Button, Section, Text } from "react-email"
import { EmailLayout } from "./email-layout"

export const PasswordResetRequestEmail = ({
  name,
  resetUrl,
  expiresInMinutes,
}: {
  name: string
  resetUrl: string
  expiresInMinutes?: number
}) => {
  return (
    <EmailLayout template="customer" heading="Reset Your Password">
      <Section className="px-6 pt-3 pb-7 sm:px-8">
        <Text className="mb-3 text-base font-semibold text-text">
          Hi {name},
        </Text>

        <Text className="text-sm leading-6">
          We received a request to reset your password. Click the button below
          to create a new password.
        </Text>

        <Button
          href={resetUrl}
          target="_blank"
          className="bg-brand my-4 inline-block rounded-md px-5 py-3 text-sm font-semibold text-white no-underline"
        >
          Reset Password
        </Button>

        <Section className="bg-details mt-5 rounded-lg border border-border px-5 py-1">
          <Text className="text-text text-sm font-semibold">
            Password Reset Link
          </Text>
          <Text className="text-sm leading-6">
            If the button above does not work, copy and paste the following link
            into your browser:
          </Text>

          <Text className="text-brand break-all">{resetUrl}</Text>

          {expiresInMinutes && (
            <Text className="mb-4">
              This link will expire in {expiresInMinutes} minutes.
            </Text>
          )}
        </Section>

        <Text className="mt-6">
          If you did not request a password reset, you can safely ignore this
          email. Your password will not be changed.
        </Text>

        <Text className="mt-6 font-semibold">
          For security reasons, please do not share this email or link with
          anyone.
        </Text>
      </Section>
    </EmailLayout>
  )
}

PasswordResetRequestEmail.PreviewProps = {
  name: "Alex Morgan",
  resetUrl: "https://example.com/reset-password?token=preview",
  expiresInMinutes: 30,
} satisfies Parameters<typeof PasswordResetRequestEmail>[0]

export default PasswordResetRequestEmail
