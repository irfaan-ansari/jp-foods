import z from "@jp/utils/validation"

export const orderCancelSchema = z.object({
  cancelReason: z.string().min(1),
})

export const cancelOrderActionSchema = z.object({
  id: z.number(),
  data: orderCancelSchema,
})
