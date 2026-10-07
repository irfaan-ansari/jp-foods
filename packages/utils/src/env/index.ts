import { z } from "zod"

const serverEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.url(),
  NEXT_PUBLIC_API_URL: z.url(),
  NEXT_PUBLIC_PUBLIC_URL: z.url(),
  NEXT_PUBLIC_ADMIN_URL: z.url(),
  NEXT_PUBLIC_CUSTOMER_URL: z.url(),
  BETTER_AUTH_SECRET: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  BLOB_READ_WRITE_TOKEN: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  TWILIO_ACCOUNT_SID: z.string().min(1),
  TWILIO_AUTH_TOKEN: z.string().min(1),
  TWILIO_SID: z.string().min(1),
  TWILIO_MESSAGING_SID: z.string().min(1),
})

export const env = serverEnvSchema.parse(process.env)

export const TRUSTED_ORIGINS = [
  env.NEXT_PUBLIC_APP_URL,
  env.NEXT_PUBLIC_ADMIN_URL,
  env.NEXT_PUBLIC_CUSTOMER_URL,
  env.NEXT_PUBLIC_PUBLIC_URL,
]
