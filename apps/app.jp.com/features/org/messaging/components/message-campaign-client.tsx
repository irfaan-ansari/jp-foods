"use client"

import { DataTable } from "@jp/ui/components/data-table"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { useMessageCampaigns } from "../messaging.data"
import { messageCampaignColumns } from "./message-campaign-columns"

export const MessageCampaignClient = () => {
  const { searchParamsObj } = useRouterStuff()
  const campaigns = useMessageCampaigns(searchParamsObj)

  return (
    <DataTable
      columns={messageCampaignColumns}
      data={campaigns.data?.data ?? []}
      getRowId={(campaign) => String(campaign.id)}
      isLoading={campaigns.isPending}
      error={{
        isError: campaigns.isError,
        title: campaigns.error?.message,
        description: campaigns.error?.description,
      }}
      empty={{
        isEmpty: campaigns.data?.data.length === 0,
        title: "No campaigns found.",
        description: "Try adjusting your search or filters.",
      }}
      pagination={campaigns.data?.pagination}
    />
  )
}
