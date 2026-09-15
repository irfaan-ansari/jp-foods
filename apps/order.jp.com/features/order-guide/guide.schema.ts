import z from "zod"

export const guideSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  productIds: z.number().positive().array(),
})

export type GuideSchema = z.infer<typeof guideSchema>

export const createGuideSchema = z.object({
  data: guideSchema,
})
export const updateGuideSchema = z.object({
  id: z.number().positive(),
  data: guideSchema,
})
