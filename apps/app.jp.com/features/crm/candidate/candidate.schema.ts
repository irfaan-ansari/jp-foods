import z from "zod"

export const candidateApplicationSchema = z.object({
  status: z.string(),
  statusReason: z.string(),
  statusDetails: z.string(),
  internalNotes: z.string(),
})

export type CandidateApplicationFormSchema = z.infer<
  typeof candidateApplicationSchema
>

export const updateCandidateApplicationSchema = z.object({
  id: z.number(),
  data: candidateApplicationSchema.partial(),
})

export const deleteCandidateApplicationSchema = z.object({
  id: z.number(),
})
