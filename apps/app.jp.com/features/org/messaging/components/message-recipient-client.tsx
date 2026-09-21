"use client"

import React from "react"
import { Pagination } from "@jp/ui/components/jp/pagination"
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

export const MessageRecipientClient = ({ campaignId }: { campaignId: number }) => {
  const { searchParamsObj, queryParams } = useRouterStuff()
  const recipients = useMessageRecipients(campaignId, searchParamsObj)

  return (
    <QueryBoundary
      query={recipients}
      loading={
        <Card size="sm" className="shadow-xs">
          <CardContent className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton className="h-14" key={index} />
            ))}
          </CardContent>
        </Card>
      }
      isEmpty={(data) => data.data.length === 0}
    >
      {(data) => (
        <Card size="sm" className="shadow-xs">
          <CardHeader>
            <CardTitle>Recipients</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="divide-y rounded-xl border">
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
                  <StatusBadge
                    status={
                      RECIPIENT_STATUS[recipient.status] ??
                      RECIPIENT_STATUS.failed!
                    }
                    size="sm"
                    className="w-fit"
                  />
                </div>
              ))}
            </div>
            <Pagination
              page={data.pagination.page}
              total={data.pagination.total}
              totalPages={data.pagination.totalPages}
              limit={data.pagination.limit}
              onPageChange={(page) =>
                queryParams({ set: { page: page.toString() } })
              }
            />
          </CardContent>
        </Card>
      )}
    </QueryBoundary>
  )
}
