import z from "zod"

export const memberRoleSchema = z.object({
  role: z.string(),
})

export const memberSchema = z.object({
  user: z.object({
    id: z.string(),
    name: z.string(),
  }),
  role: z.string().array(),
  email: z.email(),
  team: z.object({
    id: z.string(),
    name: z.string(),
  }),
})
