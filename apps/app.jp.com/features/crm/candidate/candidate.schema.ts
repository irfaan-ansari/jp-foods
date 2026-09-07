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

export const processCandidateApplicationSchema = z.object({
  id: z.number(),
  data: z.object({
    status: z.enum(["accepted", "verification_in_progress"]),
  }),
})

export const updateCandidateApplicationStatusSchema = z.object({
  id: z.number(),
  data: z.object({
    status: z.string(),
    statusReason: candidateApplicationSchema.shape.statusReason,
    statusDetails: candidateApplicationSchema.shape.statusDetails,
  }),
})

export const deleteCandidateApplicationSchema = z.object({
  id: z.number(),
})
