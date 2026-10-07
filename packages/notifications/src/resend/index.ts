import { type CreateEmailOptions, Resend } from "resend"
import { ReactElement } from "react"
import { env } from "@jp/utils/env"

export const resend = new Resend(env.RESEND_API_KEY)

const FROM_EMAIL = "Jimenez Produce <no-reply@jimenezproduce.com>"
const ADMIN_EMAILS = ["info@jimenezproduce.net"]

type SendEmailOptions = {
  to?: string | string[] | undefined
  subject: string
  template: ReactElement
  from?: string
  replyTo?: string
  attachments?: CreateEmailOptions["attachments"]
}

export async function sendEmail({
  to = ADMIN_EMAILS,
  subject,
  template,
  from = FROM_EMAIL,
  replyTo,
  attachments,
}: SendEmailOptions) {
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    react: template,
    replyTo,
    attachments,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}
