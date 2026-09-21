import { AppError } from "@jp/utils"
import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import type { PaginatedResponse } from "@/features/shared/shared.type"
import type { MessageCampaign, MessageRecipient } from "./messaging.type"

type MessageQuery = Record<string, string | number | undefined>

export const useMessageCampaigns = (kv?: MessageQuery) => {
  return useQuery<PaginatedResponse<MessageCampaign>, AppError>({
    queryKey: ["message-campaigns", kv],
    queryFn: () => apiClient.get("/org/messaging", { params: kv }),
    staleTime: 1000 * 60,
  })
}

export const useMessageCampaign = (id: number | string) => {
  return useQuery<{ success: boolean; data: MessageCampaign }, AppError>({
    queryKey: ["message-campaigns", id],
    queryFn: () => apiClient.get(`/org/messaging/${id}`),
    staleTime: 1000 * 60,
  })
}

export const useMessageRecipients = (
  campaignId: number | string,
  kv?: MessageQuery
) => {
  return useQuery<PaginatedResponse<MessageRecipient>, AppError>({
    queryKey: ["message-recipients", campaignId, kv],
    queryFn: () =>
      apiClient.get(`/org/messaging/${campaignId}/recipients`, { params: kv }),
    staleTime: 1000 * 60,
  })
}
