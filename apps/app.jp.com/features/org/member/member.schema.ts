import z from "zod"

export const memberRoleSchema = z.object({
  role: z.string(),
})

export const memberSchema = z.object({
  id: z.string().optional(),
  user: z.object({
    id: z.string(),
    name: z.string(),
  }),
  role: z.string(),
})

export type MemberFormValues = z.infer<typeof memberSchema>

export const createMemberActionSchema = z.object({
  userId: z.string(),
  role: z.string(),
})

export const updateMemberActionSchema = z.object({
  memberId: z.string(),
  role: z.string(),
})
