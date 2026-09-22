import z from "zod"
import { phoneSchema } from "@jp/utils"

export const profileSchema = z.object({
  image: z.string(),
  name: z.string(),
})

export const userSchema = profileSchema.extend({
  phoneNumber: phoneSchema,
  email: z.email("Invalid email"),
  role: z.enum([
    "superAdmin",
    "admin",
    "user",
    "reviewer",
    "customer",
    "driver",
  ]),
})
export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type ProfileFormSchema = z.infer<typeof profileSchema>
export type UserFormSchema = z.infer<typeof userSchema>
export type PasswordFormSchema = z.infer<typeof passwordSchema>

export const changePhoneSchema = z.object({
  phoneNumber: phoneSchema,
  code: z.string().min(6, "Enter the 6-digit verification code"),
})

export const changeEmailSchema = z.object({
  newEmail: z.email("Invalid email"),
  code: z.string().min(6, "Enter the 6-digit verification code"),
})

export type ChangePhoneFormSchema = z.infer<typeof changePhoneSchema>
export type ChangeEmailFormSchema = z.infer<typeof changeEmailSchema>
