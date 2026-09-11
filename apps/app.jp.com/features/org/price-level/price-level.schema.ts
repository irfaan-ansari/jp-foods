import { numberSchema } from "@jp/utils"
import z from "zod"

const sellUnitSchema = z.object({
  id: z.number(),
  unit: z.string(),
  basePrice: z.string().nullable(),
  price: z.string().min(1, "Adjustment price is required"),
})
const productSchema = z.object({
  id: z.number(),
  sellUnits: sellUnitSchema.array(),
  title: z.string(),
  itemCode: z.string(),
  image: z.string().nullable(),
})

const baseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  appliesTo: z.string(),
  adjustmentType: z.string(),
  adjustmentValue: numberSchema,
  status: z.string(),
})
export const priceLevelSchema = baseSchema
  .extend({
    products: productSchema.array(),
  })
  .superRefine((data, ctx) => {
    const { appliesTo, products, adjustmentValue } = data

    if (appliesTo === "per_item") {
      if (!products || products.length === 0) {
        ctx.addIssue({
          code: "custom",
          message: "Select at least one item for this price level",
          path: ["products"],
        })
      }
      data.adjustmentValue = ""
    } else if (appliesTo === "all") {
      if (adjustmentValue === undefined || adjustmentValue === null) {
        ctx.addIssue({
          code: "custom",
          message: "Adjustment value is required",
          path: ["adjustmentValue"],
        })
      }
    }
  })

export type PriceLevelFormSchema = z.infer<typeof priceLevelSchema>

const levelCreateSchema = baseSchema.extend({
  products: z
    .object({
      id: z.number(),
      sellUnitId: z.number(),
      price: z.string(),
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
