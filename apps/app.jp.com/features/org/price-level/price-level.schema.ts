import { numberSchema } from "@jp/utils"
import z from "zod"

export const priceLevelSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    appliesTo: z.string(),
    adjustmentType: z.string(),
    adjustmentValue: numberSchema,
    status: z.string(),
    products: z.array(
      z.object({
        id: z.number(),
        sellUnitId: z.number(),
        title: z.string(),
        itemCode: z.string(),
        image: z.string().nullable(),
        basePrice: z.string(),
        price: z.string(),
      })
    ),
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

export const createPriceLevelSchema = z.object({
  data: priceLevelSchema,
})

export const updatePriceLevelSchema = z.object({
  id: z.number().positive(),
  data: priceLevelSchema,
})

export const deletePriceLevelSchema = z.object({
  id: z.number().positive(),
})
