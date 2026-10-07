import z from "@jp/utils/validation"

export const invitationSchema = z.object({
  email: z.email("Invalid email"),
  organizationId: z.string(),
  teamId: z.string(),
})

export type InvitationFormSchema = z.infer<typeof invitationSchema>
