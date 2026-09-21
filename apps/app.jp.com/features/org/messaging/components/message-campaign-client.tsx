"use client"

import React from "react"
import { BlurFade } from "@jp/ui/components/blur-fade"
import { Pagination } from "@jp/ui/components/jp/pagination"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"

import { GridWrapper } from "@/components/page-content"
import { QueryBoundary } from "@/components/query-boundry"
import { useMessageCampaigns } from "../messaging.data"
import {
  MessageCampaignCard,
  MessageCampaignSkeleton,
} from "./message-campaign-card"

export const MessageCampaignClient = () => {
  const { searchParamsObj, queryParams } = useRouterStuff()
  const campaigns = useMessageCampaigns(searchParamsObj)

  return (
    <QueryBoundary
      query={campaigns}
      loading={
        <GridWrapper>
          {Array.from({ length: 12 }).map((_, i) => (
            <MessageCampaignSkeleton key={i} />
          ))}
        </GridWrapper>
      }
      isEmpty={(data) => data.data.length === 0}
    >
      {(data) => (
        <>
          <GridWrapper>
            {data.data.map((campaign, i) => (
              <BlurFade
                key={campaign.id}
                delay={0.2 + i * 0.01}
                inView
                direction="up"
              >
                <MessageCampaignCard data={campaign} />
              </BlurFade>
            ))}
          </GridWrapper>
          <Pagination
            page={data.pagination.page}
            total={data.pagination.total}
            totalPages={data.pagination.totalPages}
            limit={data.pagination.limit}
            onPageChange={(page) =>
              queryParams({ set: { page: page.toString() } })
            }
          />
        </>
      )}
    </QueryBoundary>
  )
}
