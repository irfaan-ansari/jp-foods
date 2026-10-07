import twilio from "twilio"
import { env } from "@jp/utils/env"

export const twilioClient = twilio(
  env.TWILIO_ACCOUNT_SID,
  env.TWILIO_AUTH_TOKEN
)

export const twilioSendOTP = async ({
  phoneNumber,
}: {
  phoneNumber: string
}) => {
  return await twilioClient.verify.v2
    .services(env.TWILIO_SID)
    .verifications.create({
      to: phoneNumber,
      channel: "sms",
    })
}

export const twilioVerifyOTP = async ({
  phoneNumber,
  code,
}: {
  phoneNumber: string
  code: string
}) => {
  return await twilioClient.verify.v2
    .services(env.TWILIO_SID)
    .verificationChecks.create({
      to: phoneNumber,
      code,
    })
}

export const twilioSendSms = async ({
  to,
  body,
}: {
  to: string
  body: string
}) => {
  return await twilioClient.messages.create({
    to,
    body,
    messagingServiceSid: env.TWILIO_MESSAGING_SID,
  })
}
