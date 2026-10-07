import z from "@jp/utils/validation"

export const teamFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  managerName: z.string(),
  phoneNumber: z.string().min(1, "Phone is required"),
  email: z.email("Invalid email"),
  logo: z.string(),
  street: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "Zip is required"),
  receivingName: z.string(),
  receivingPhone: z.string(),
})

export type TeamFormSchema = z.infer<typeof teamFormSchema>
