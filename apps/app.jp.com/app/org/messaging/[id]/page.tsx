"use client"

import React from "react"
import { useParams } from "next/navigation"
import { ErrorState } from "@jp/ui/components/jp"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"

import { PageContent, PageHeader } from "@/components/page-content"
import { StatusBadge } from "@/components/status-badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"
import { MESSAGE_STATUS } from "@/features/org/messaging/messaging.const"
import { useMessageCampaign } from "@/features/org/messaging/messaging.data"
import { MessageRecipientClient } from "@/features/org/messaging/components/message-recipient-client"

const MessageCampaignPage = () => {
  const params = useParams()
  const { searchParams } = useRouterStuff()
  const id = Number(params.id)

  const {
    data: campaign,
    isPending,
    isError,
    error,
  } = useMessageCampaign(id)

  const data = campaign?.data

  return (
    <React.Fragment>
      <PageHeader
        title={data?.name ?? "Message Campaign"}
        backUrl={`/org/messaging?${searchParams}`}
        loading={isPending}
      />
      <PageContent loading={isPending} className="space-y-6">
        {isError ? (
          <ErrorState title={error.message} description={error.description} />
        ) : data ? (
          <React.Fragment>
            <Card size="sm" className="shadow-xs">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="grid gap-1">
                    <CardTitle>{data.name}</CardTitle>
                    <CardDescription>{data.message}</CardDescription>
                  </div>
                  <StatusBadge
                    status={MESSAGE_STATUS[data.status] ?? MESSAGE_STATUS.failed!}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-4">
                  <Metric label="Recipients" value={data.recipientCount} />
                  <Metric label="Sent" value={data.sentCount} />
                  <Metric label="Failed" value={data.failedCount} />
                  <Metric label="Skipped" value={data.skippedCount} />
                </div>
              </CardContent>
            </Card>
            <MessageRecipientClient campaignId={id} />
          </React.Fragment>
        ) : null}
      </PageContent>
    </React.Fragment>
  )
}

const Metric = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-xl bg-secondary p-4">
    <div className="text-2xl font-semibold">{value}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </div>
)

export default MessageCampaignPage
