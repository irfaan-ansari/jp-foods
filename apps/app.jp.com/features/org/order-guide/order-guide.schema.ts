import z from "zod"

export const orderGuideSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  team: z.object({
    id: z.string(),
    name: z.string().optional(),
  }),
  products: z
    .array(
      z.object({
        id: z.number(),
        title: z.string(),
        itemCode: z.string(),
        image: z.any(),
        basePrice: z.string(),
      })
    )
    .min(1, "Select products"),
})

export type OrderGuideFormSchema = z.infer<typeof orderGuideSchema>

const actionSchema = orderGuideSchema
  .omit({ products: true, team: true })
  .extend({
    productIds: z.number().array(),
    teamId: z.string(),
  })

const orderGuideIdSchema = z.object({
  id: z.number().int().positive(),
})

export const createOdrerGuideSchema = z.object({
  data: actionSchema,
})

export const updateOdrerGuideSchema = orderGuideIdSchema.extend({
  data: actionSchema,
})

export const deleteOdrerGuideSchema = orderGuideIdSchema
