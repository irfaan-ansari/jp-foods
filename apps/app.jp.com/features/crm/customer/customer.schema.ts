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
  data: customerApplicationSchema.partial(),
})

export const processCustomerApplicationSchema = z.object({
  id: z.number(),
  data: z.object({
    status: z.enum(["active", "under_review"]),
  }),
})

export const updateCustomerApplicationStatusSchema = z.object({
  id: z.number(),
  data: z.object({
    status: z.string(),
    statusReason: customerApplicationSchema.shape.statusReason,
    statusDetails: customerApplicationSchema.shape.statusDetails,
  }),
})

export const deleteCustomerApplicationSchema = z.object({
  id: z.number(),
})
