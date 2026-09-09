import z from "zod"

export const userSchema = z.object({
  name: z.string(),
  phoneNumber: z.string(),
  email: z.string(),
  role: z.string(),
})

export type UserFormSchema = z.infer<typeof userSchema>

export const userPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
    newPassword: z.string(),
  })
  .refine((data) => data.password === data.newPassword, {
    message: "Passwords do not match",
    path: ["newPassword"],
  })

export type UserPasswordFormSchema = z.infer<typeof userPasswordSchema>
