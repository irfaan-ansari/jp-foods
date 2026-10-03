import z from "zod"

export const otpLoginSchema = z.object({
  phoneNumber: z
    .string()
    .regex(/^\+[1-9]\d{7,14}$/, "Enter a valid phone number with country code"),
  code: z.string().regex(/^\d{6}$/, "Enter the 6-digit code"),
  step: z.enum(["send", "verify"]),
  error: z.string(),
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
