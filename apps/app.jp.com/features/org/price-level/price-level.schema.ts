import z from "zod"

const productSchema = z.object({
  id: z.number(),
  unit: z.string(),
  basePrice: z.string(),
  price: z.string(),
  title: z.string(),
  itemCode: z.string(),
  image: z.string().nullable(),
})

const baseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  appliesTo: z.string(),
  adjustmentType: z.string(),
  adjustmentValue: z.string(),
  status: z.string(),
})
const validateAdjustments = (
  data: {
    appliesTo: string
    products: { id: number; price: string }[]
    adjustmentValue: string
  },
  ctx: z.RefinementCtx
) => {
  const { appliesTo, products, adjustmentValue } = data

  if (appliesTo === "per_item") {
    if (!products || products.length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "Select at least one item for this price level",
        path: ["products"],
      })
    }
    const ids = new Set<number>()
    products.forEach((product, index) => {
      if (ids.has(product.id))
        ctx.addIssue({
          code: "custom",
          path: ["products", index, "id"],
          message: "Select each product only once",
        })
      ids.add(product.id)
      if (!product.price.trim() || !Number.isFinite(Number(product.price)))
        ctx.addIssue({
          code: "custom",
          path: ["products", index, "price"],
          message: "Enter a valid adjustment",
        })
    })
  } else if (appliesTo === "all") {
    if (!adjustmentValue.trim() || !Number.isFinite(Number(adjustmentValue))) {
      ctx.addIssue({
        code: "custom",
        message: "Adjustment value is required",
        path: ["adjustmentValue"],
      })
    }
  }
}

export const priceLevelSchema = baseSchema
  .extend({ products: productSchema.array() })
  .superRefine(validateAdjustments)

export type PriceLevelFormSchema = z.infer<typeof priceLevelSchema>

const levelCreateSchema = baseSchema
  .extend({
    products: z
      .object({
        id: z.number(),
        price: z.string(),
      })
      .array(),
  })
  .superRefine(validateAdjustments)
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
