import z from "zod"

export const invitationSchema = z.object({
  email: z.email("Invalid email"),
  organizationId: z.string(),
  teamId: z.string(),
})

export type InvitationFormSchema = z.infer<typeof invitationSchema>
