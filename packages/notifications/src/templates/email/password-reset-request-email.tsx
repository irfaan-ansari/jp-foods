import { Button, Hr, Section, Text } from "react-email"
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
      <Section className="p-6">
        <Text className="text-xl">Hi {name},</Text>

        <Text className="text-lg">
          We received a request to reset your password. Click the button below
          to create a new password.
        </Text>

        <Button
          href={resetUrl}
          target="_blank"
          className="bg-email-brand inline-flex items-center p-4 text-sm font-semibold text-white uppercase"
        >
          Reset Password
        </Button>

        <Text className="text-lg">
          If the button above does not work, copy and paste the following link
          into your browser:
        </Text>

        <Text className="text-base break-all text-blue-600">{resetUrl}</Text>

        {expiresInMinutes && (
          <Text className="mb-4 text-base">
            This link will expire in {expiresInMinutes} minutes.
          </Text>
        )}

        <Text className="mb-6 text-base">
          If you did not request a password reset, you can safely ignore this
          email. Your password will not be changed.
        </Text>

        <Hr />

        <Text className="text-email-note mt-6 text-sm">
          For security reasons, please do not share this email or link with
          anyone.
        </Text>
      </Section>
    </EmailLayout>
  )
}
