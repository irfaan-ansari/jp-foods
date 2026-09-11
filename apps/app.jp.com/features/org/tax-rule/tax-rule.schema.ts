import z from "zod"

export const taxRuleSchena = z.object({
  name: z.string(),
  rate: z.string(),
})
