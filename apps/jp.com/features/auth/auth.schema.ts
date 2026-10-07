import z from "@jp/utils/validation"

export const otpLoginSchema = z.object({
  phoneNumber: z
    .string()
    .min(5, "Enter a valid phone number with country code"),
  code: z.string().regex(/^\d{6}$/, "Enter the 6-digit code"),
  step: z.enum(["send", "verify"]),
})

/** form schema */
export const loginFormSchema = z.object({
  username: z.union(
    [
      z.string().min(5, "Enter a valid phone number with country code"),
      z.email("Enter a valid email"),
    ],
    "Enter valid email or phone number"
  ),
  password: z.string().min(2, "Enter password"),
})
