import z from "zod"

const lineItemSchema = z.object({
  productId: z.number().positive(),
  lineItemId: z.number().optional(),
  unit: z.string().min(1),
  quantity: z.number().int().positive(),
})

export const orderSchema = z.object({
  po: z.string().optional(),
  deliveryDate: z.iso.date(),
  deliveryWindow: z.string().optional(),
  deliveryInstruction: z.string().optional(),
  items: lineItemSchema.array().min(1),
})

export const createOrderSchema = z.object({
  data: orderSchema,
})

export const updateOrderSchema = z.object({
  id: z.number(),
  data: orderSchema,
})
