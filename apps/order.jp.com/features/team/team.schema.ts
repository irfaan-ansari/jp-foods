import z from "zod"
import { phoneSchema } from "@jp/utils"

export const teamFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phoneNumber: phoneSchema,
  email: z.email("Invalid email"),
  logo: z.string(),
  street: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "Zip is required"),
})

export type TeamFormSchema = z.infer<typeof teamFormSchema>
