import z from "@jp/utils/validation"

export const cartRedisEnvSchema = z.object({
  REDIS_URL: z.url(),
  REDIS_TOKEN: z.string().min(1),
})

export const cartItemSchema = z.object({
  id: z.string(),
  title: z.string().max(200),
  price: z.number(),
  quantity: z.number(),
  unit: z.string().max(32),
  total: z.number(),
  image: z.string().max(2048), // URL only, never a data URI
})

export const cartEventSchema = z.object({
  type: z.literal("cart.updated"),
  itemCount: z.number().int().nonnegative(),
  total: z.number(),
  items: z.array(cartItemSchema).max(200),
})

export const cartActivitySchema = z.object({
  id: z.string(),
  kind: z.enum(["added", "removed", "quantity_changed"]),
  item: cartItemSchema
    .pick({ id: true, title: true, image: true, unit: true })
    .extend({ price: z.number().optional() }),
  quantity: z.number(),
  previousQuantity: z.number(),
  userId: z.string(),
  userName: z.string().optional(),
  teamId: z.string(),
  at: z.string(),
})

export const cartEventPayloadSchema = cartEventSchema.extend({
  organizationId: z.string().min(1),
  teamId: z.string().min(1),
  userId: z.string().min(1),
  emittedAt: z.string().min(1),
})
