import z from "@jp/utils/validation"

export const cartRedisEnvSchema = z.object({
  REDIS_URL: z.url(),
  REDIS_TOKEN: z.string().min(1),
})

export const cartEventSchema = z
  .object({
    type: z.string().min(1).default("cart.updated"),
    status: z.enum(["active", "checking_out", "placed"]).default("active"),
    orderId: z.number().int().positive().optional(),
    itemCount: z.number().int().nonnegative(),
    total: z.number().nonnegative(),
    items: z
      .array(
        z
          .object({
            id: z.string(),
            price: z.number(),
            quantity: z.number(),
            unit: z.string(),
            total: z.number().nonnegative(),
          })
          .passthrough()
      )
      .default([]),
  })
  .passthrough()
  .superRefine((event, ctx) => {
    if (event.status === "placed" && !event.orderId) {
      ctx.addIssue({
        code: "custom",
        message: "orderId is required when status is placed",
        path: ["orderId"],
      })
    }

    if (event.status !== "placed" && event.orderId) {
      ctx.addIssue({
        code: "custom",
        message: "orderId is only allowed when status is placed",
        path: ["orderId"],
      })
    }
  })

export const cartEventPayloadSchema = cartEventSchema.extend({
  organizationId: z.string().min(1),
  teamId: z.string().min(1),
  userId: z.string().min(1),
  emittedAt: z.string().min(1),
})
