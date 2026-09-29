import { Resend } from "resend"
import { ReactElement } from "react"

export const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = "Jimenez Produce <no-reply@jimenezproduce.com>"
const ADMIN_EMAILS = ["info@jimenezproduce.net"]

type SendEmailOptions = {
  to?: string | string[]
  subject: string
  template: ReactElement
  from?: string
  replyTo?: string
}

export async function sendEmail({
  to = ADMIN_EMAILS,
  subject,
  template,
  from = FROM_EMAIL,
  replyTo,
}: SendEmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is required to send email")
  }

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    react: template,
    replyTo,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}
