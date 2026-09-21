"use client"

import React from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"
import { Skeleton } from "@jp/ui/components/skeleton"
import { formatDate } from "@jp/utils"
import { StatusBadge } from "@/components/status-badge"
import { MESSAGE_STATUS } from "../messaging.const"
import type { MessageCampaign } from "../messaging.type"

export const MessageCampaignCard = ({ data }: { data: MessageCampaign }) => {
  return (
    <Card
      size="sm"
      className="relative h-full shadow-xs transition hover:-translate-y-0.5 hover:bg-secondary/40 hover:shadow-sm"
    >
      <Link href={`/org/messaging/${data.id}`} className="absolute inset-0 z-1" />
      <CardHeader>
        <div className="grid min-w-0 gap-1">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="line-clamp-1">{data.name}</CardTitle>
            <StatusBadge
              status={MESSAGE_STATUS[data.status] ?? MESSAGE_STATUS.failed!}
              size="sm"
            />
          </div>
          <CardDescription className="line-clamp-2">
            {data.message}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <Stat label="Recipients" value={data.recipientCount} />
          <Stat label="Sent" value={data.sentCount} />
          <Stat label="Failed" value={data.failedCount} />
        </div>
        <div className="border-t border-dashed" />
        <p className="text-muted-foreground">
          {data.sentAt
            ? `Sent ${formatDate(data.sentAt)}`
            : `Created ${formatDate(data.createdAt)}`}
        </p>
      </CardContent>
    </Card>
  )
}

const Stat = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-lg bg-secondary p-2">
    <div className="text-sm font-semibold">{value}</div>
    <div className="text-[11px] text-muted-foreground">{label}</div>
  </div>
)

export const MessageCampaignSkeleton = () => (
  <Card className="shadow-none" size="sm">
    <CardContent className="space-y-4">
      <Skeleton className="h-4 w-3/5" />
      <Skeleton className="h-10 w-full" />
      <div className="grid grid-cols-3 gap-2">
        <Skeleton className="h-14" />
        <Skeleton className="h-14" />
        <Skeleton className="h-14" />
      </div>
    </CardContent>
  </Card>
)
