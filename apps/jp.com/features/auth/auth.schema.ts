import z from "zod"

/** server action schema */
const phoneNumberSchema = z
  .string()
  .regex(/^\+[1-9]\d{7,14}$/, "Enter a valid phone number with country code")

export const sendOtpSchema = z.object({ phoneNumber: phoneNumberSchema })

export const verifyOtpSchema = z.object({
  phoneNumber: phoneNumberSchema,
  code: z.string().regex(/^\d{6}$/, "Enter the 6-digit code"),
})

/** form schema */
export const loginFormSchema = z.object({
  username: z.union(
    [
      z.string().regex(/^[6-9]\d{9}$/, "Enter a valid phone number"),
      z.email("Enter valid email"),
    ],
    "Enter valid email or phone number"
  ),
  password: z.string().min(2, "Enter password"),
  error: z.string(),
})
