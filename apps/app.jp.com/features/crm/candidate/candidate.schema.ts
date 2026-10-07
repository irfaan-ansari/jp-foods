import z from "@jp/utils/validation"

import { CANDIDATE_APPLICATION_STATUSES } from "./candidate.type"

export const candidateApplicationStatusSchema = z.enum(
  CANDIDATE_APPLICATION_STATUSES
)

export const candidateApplicationSchema = z.object({
  status: candidateApplicationStatusSchema,
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
