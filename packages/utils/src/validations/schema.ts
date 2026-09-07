import z from "zod"

export const phoneSchema = z
  .string()
  .transform((val) => val.replace(/\D/g, ""))
  .refine((val) => val.length === 10, {
    message: "Enter valid phone number",
  })

export const numberSchema = z
  .string()
  .transform((val) => val.replace(/\D/g, ""))
  .refine(
    (value) => {
      const n = Number(value)
      return !Number.isNaN(n) && n >= 0
    },
    {
      message: "Enter a valid value",
    }
  )
