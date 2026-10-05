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

const unitQuantitySchema = z
  .string()
  .regex(/^\d{1,10}(\.\d{1,2})?$/, "Enter a weight with up to 2 decimal places")
  .refine((value) => Number(value) > 0, "Weight must be greater than zero")

export const completeOrderSchema = z.object({
  lineItems: z
    .object({
      lineItemId: z.number().int().positive(),
      title: z.string(),
      stockUOM: z.string().nullable(),
      price: z.string(),
      unitQuantity: unitQuantitySchema,
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
      unitQuantity: unitQuantitySchema,
    })
    .array(),
})

export const generateInvoiceSchema = orderIdSchema

export const rescheduleOrderSchema = orderIdSchema.extend({
  data: orderSchema.omit({ status: true }),
})
export const updateOrderSchema = orderIdSchema.extend({
  data: orderSchema.omit({ status: true }),
})
