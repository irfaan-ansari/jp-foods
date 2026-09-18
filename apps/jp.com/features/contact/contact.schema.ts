import { z } from "zod"

export const CONTACT_SCHEMA = z.object({
  name: z.string().min(2, "Name is required"),
  companyName: z.string().min(2, "Business name is required"),
  companyType: z.string().min(2, "Business type is required"),
  email: z.email("Invalid email address"),
  phone: z
    .string()
    .trim()
    .regex(
      /^(\+1\s?)?(\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}$/,
      "Invalid phone number"
    ),
  message: z.string().trim().min(1, "Message is required"),
})
