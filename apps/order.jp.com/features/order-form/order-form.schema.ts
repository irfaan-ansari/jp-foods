import z from "zod"

const lineItemSchema = z.object({
  id: z.number().positive(),
  unit: z.string().min(1),
  quantity: z.number().positive(),
})

export const orderSchema = z.object({
  po: z.string(),
  deliveryDate: z.string(),
  deliveryWindow: z.string(),
  deliveryInstruction: z.string(),
  items: lineItemSchema.array().min(1),
})

export const createOrderSchema = z.object({
  data: orderSchema,
})

export const updateOrderSchema = z.object({
  id: z.number(),
  data: orderSchema,
})
