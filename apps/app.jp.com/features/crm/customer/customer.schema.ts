import z from "zod"

export const customerApplicationSchema = z.object({
  status: z.string(),
  statusReason: z.string(),
  statusDetails: z.string(),
  internalNotes: z.string(),
})

export type CustomerApplicationFormSchema = z.infer<
  typeof customerApplicationSchema
>

export const updateCustomerApplicationSchema = z.object({
  id: z.number(),
  data: customerApplicationSchema,
})

export const deleteCustomerApplicationSchema = z.object({
  id: z.number(),
})
