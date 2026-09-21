"use client"

import React from "react"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"

import { StatusBadge } from "@/components/status-badge"
import { QueryBoundary } from "@/components/query-boundry"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"
import { Skeleton } from "@jp/ui/components/skeleton"
import { RECIPIENT_STATUS } from "../messaging.const"
import { useMessageRecipients } from "../messaging.data"

export const MessageRecipientClient = ({
  campaignId,
}: {
  campaignId: number
}) => {
  const { searchParamsObj, queryParams } = useRouterStuff()
  const recipients = useMessageRecipients(campaignId, searchParamsObj)

  return (
    <Card size="sm" className="gap-0">
      <CardHeader className="border-b">
        <CardTitle>Recipients</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-0">
        <QueryBoundary
          query={recipients}
          loading={
            <div className="space-y-3 px-4 pt-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton className="h-14" key={index} />
              ))}
            </div>
          }
          isEmpty={(data) => data.data.length === 0}
        >
          {(data) => (
            <div className="divide-y">
              {data.data.map((recipient) => (
                <div
                  className="grid gap-2 p-3 text-sm md:grid-cols-[1fr_160px_110px]"
                  key={recipient.id}
                >
                  <div className="min-w-0">
                    <div className="font-medium">
                      {recipient.name ?? recipient.phoneNumber}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {recipient.phoneNumber}
                    </div>
                    {recipient.errorMessage && (
                      <div className="mt-1 text-xs text-destructive">
                        {recipient.errorMessage}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {recipient.providerMessageId ?? recipient.source}
                  </div>
                  <div className="text-right">
                    <StatusBadge
                      status={
                        RECIPIENT_STATUS[recipient.status] ??
                        RECIPIENT_STATUS.failed!
                      }
                      size="sm"
                      className="w-fit"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </QueryBoundary>
      </CardContent>
    </Card>
  )
}
