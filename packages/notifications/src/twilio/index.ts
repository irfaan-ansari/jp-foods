import twilio from "twilio"

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const serviceId = process.env.TWILIO_SID
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID
const fromNumber = process.env.TWILIO_FROM_NUMBER

export const twilioClient = twilio(accountSid, authToken)

export const twilioSendOTP = async ({
  phoneNumber,
}: {
  phoneNumber: string
}) => {
  return await twilioClient.verify.v2
    .services(serviceId!)
    .verifications.create({
      to: `${phoneNumber}`,
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
    .services(serviceId!)
    .verificationChecks.create({
      to: `${phoneNumber}`,
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
  if (!messagingServiceSid && !fromNumber) {
    throw new Error(
      "TWILIO_MESSAGING_SERVICE_SID or TWILIO_FROM_NUMBER is required"
    )
  }

  return await twilioClient.messages.create({
    to,
    body,
    ...(messagingServiceSid
      ? { messagingServiceSid }
      : { from: fromNumber as string }),
  })
}
