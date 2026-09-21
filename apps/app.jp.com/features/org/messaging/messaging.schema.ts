import z from "zod"

export const messageRecipientSchema = z.object({
  id: z.string(),
  name: z.string(),
  phoneNumber: z.string(),
  source: z.enum(["team"]),
})

export const sendMessageSchema = z.object({
  name: z.string().min(2, "Campaign name is required"),
  message: z.string().min(1, "Message is required").max(1500),
  manualNumbers: z.string().optional(),
  teams: z.array(messageRecipientSchema),
})

export type SendMessageFormValues = z.infer<typeof sendMessageSchema>

export const sendMessageActionSchema = z.object({
  data: sendMessageSchema
    .omit({ teams: true })
    .extend({ teamIds: z.string().array() }),
})

export const deleteMessageCampaignSchema = z.object({
  id: z.number().int().positive(),
})
