import z from "zod"

const productSchema = z.object({
  id: z.number(),
  title: z.string(),
  itemCode: z.string(),
  image: z.string().nullable(),
  adjustmentValue: z.string(),
})

const baseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  appliesTo: z.string(),
  adjustmentType: z.string(),
  adjustmentValue: z.string(),
  status: z.string(),
})

export const priceLevelSchema = baseSchema.extend({
  products: productSchema.array(),
})

export type PriceLevelFormSchema = z.infer<typeof priceLevelSchema>

const levelCreateSchema = baseSchema.extend({
  products: z
    .object({
      id: z.number(),
      adjustmentValue: z.string(),
    })
    .array(),
})

export const createPriceLevelSchema = z.object({
  data: levelCreateSchema,
})

export const updatePriceLevelSchema = z.object({
  id: z.number().positive(),
  data: levelCreateSchema,
})

export const deletePriceLevelSchema = z.object({
  id: z.number().positive(),
})
