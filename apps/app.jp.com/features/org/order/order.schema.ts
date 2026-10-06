import z from "zod"

const orderIdSchema = z.object({
  id: z.number().int().positive(),
})

export const orderSchema = z.object({
  status: z.enum(["completed", "processing"]),
  deliveryDate: z.string(),
  deliveryWindow: z.string(),
})

export const cancelOrderSchema = orderIdSchema

export const completeOrderSchema = z.object({
  lineItems: z
    .object({
      lineItemId: z.number().int().positive(),
      title: z.string(),
      quantity: z.number(),
      stockUOM: z.string().nullable(),
      unit: z.string().nullable(),
      price: z.string(),
      unitQuantity: z.string(),
    })
    .array(),
})

export type UpdateOrderFormSchema = z.infer<typeof orderSchema>
export type CompleteOrderFormSchema = z.infer<typeof completeOrderSchema>

/**
 * action schema
 */
export const completeOrderActionSchema = orderIdSchema.extend({
  data: z
    .object({
      lineItemId: z.number().int().positive(),
      unitQuantity: z.string(),
    })
    .array(),
})

export const generateInvoiceSchema = orderIdSchema

export const rescheduleOrderSchema = orderIdSchema.extend({
  data: orderSchema.omit({ status: true }),
})
export const updateOrderSchema = orderIdSchema.extend({
  data: orderSchema.omit({ deliveryDate: true, deliveryWindow: true }),
})
