import z from "zod"

const orderIdSchema = z.object({
  id: z.number().int().positive(),
})

export const orderSchema = z.object({
  status: z.enum(["completed"]),
  deliveryDate: z.string(),
  deliveryWindow: z.string(),
})

export const cancelOrderSchema = orderIdSchema
export const completeOrderSchema = orderIdSchema

export const rescheduleOrderSchema = orderIdSchema.extend({
  data: orderSchema.omit({ status: true }),
})
export const updateOrderSchema = orderIdSchema.extend({
  data: orderSchema,
})

export type UpdateOrderFormSchema = z.infer<typeof orderSchema>
