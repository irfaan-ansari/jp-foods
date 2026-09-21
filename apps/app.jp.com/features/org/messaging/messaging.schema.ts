import z from "zod"

export const messageRecipientSchema = z.object({
  id: z.string(),
  name: z.string(),
  phoneNumber: z.string(),
  source: z.enum(["manual", "team", "user"]),
  teamId: z.string().optional(),
  userId: z.string().optional(),
  teamName: z.string().optional(),
})

export const sendMessageSchema = z.object({
  name: z.string().min(2, "Campaign name is required"),
  templateKey: z.string().optional(),
  message: z.string().min(1, "Message is required").max(1500),
  manualNumbers: z.string().optional(),
  teams: z.array(messageRecipientSchema),
  users: z.array(messageRecipientSchema),
})

export type SendMessageFormValues = z.infer<typeof sendMessageSchema>

export const sendMessageActionSchema = z.object({
  data: sendMessageSchema,
})

export const deleteMessageCampaignSchema = z.object({
  id: z.number().int().positive(),
})
