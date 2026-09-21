import type { MessageCampaignSelectType, MessageRecipientSelectType } from "@jp/db"

export type MessageRecipientDraft = {
  id: string
  name: string
  phoneNumber: string
  source: "manual" | "team" | "user"
  teamId?: string
  userId?: string
  teamName?: string
}

export type MessageCampaign = MessageCampaignSelectType & {
  creator?: {
    id: string
    name: string
  } | null
}

export type MessageRecipient = MessageRecipientSelectType
