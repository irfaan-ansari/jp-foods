import z from "zod"

export const taxRuleSchema = z.object({
  name: z.string(),
  rate: z.string(),
})
export type TaxRuleFormValues = z.infer<typeof taxRuleSchema>

export const createTaxRuleSchema = z.object({
  data: taxRuleSchema,
})
export const updateTaxRuleSchema = z.object({
  id: z.number("Invalid tax rule ID"),
  data: taxRuleSchema,
})

export const deleteTaxRuleSchema = z.object({
  id: z.number("Invalid tax rule ID"),
})
