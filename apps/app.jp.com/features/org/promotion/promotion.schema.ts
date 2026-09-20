import z from "zod"

export const promotionStatusSchema = z.enum(["active", "inactive"])
export const promotionPlacementSchema = z.enum([
  "sidebar",
  "banner",
  "new-order",
  "cart",
])

export const promotionTeamSchema = z.object({
  id: z.string(),
  name: z.string(),
  phoneNumber: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
})

export const promotionProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  image: z.string().nullable().optional(),
  itemCode: z.string(),
  price: z.string(),
})

export const promotionSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  media: z.string(),
  status: promotionStatusSchema,
  placement: promotionPlacementSchema,
  teams: z.array(promotionTeamSchema),
  products: z.array(promotionProductSchema),
  triggerProducts: z.array(promotionProductSchema),
})

export type PromotionFormValues = z.infer<typeof promotionSchema>

const actionSchema = promotionSchema
  .omit({ teams: true, products: true, triggerProducts: true })
  .extend({
    teamIds: z.array(z.string()),
    productIds: z.array(z.number()),
    triggerProductIds: z.array(z.number()),
  })

const promotionIdSchema = z.object({
  id: z.number().int().positive(),
})

export const createPromotionSchema = z.object({
  data: actionSchema,
})

export const updatePromotionSchema = promotionIdSchema.extend({
  data: actionSchema,
})

export const deletePromotionSchema = promotionIdSchema

export const updatePromotionStatusSchema = promotionIdSchema.extend({
  status: promotionStatusSchema,
})
