"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { createColumnHelper } from "@tanstack/react-table"
import type { DataTableFeatures } from "@jp/ui/components/data-table"
import { formatDate } from "@jp/utils"
import { StatusBadge } from "@/components/status-badge"
import type { MessageCampaign } from "../messaging.type"
import { MESSAGE_STATUS } from "../messaging.const"

const column = createColumnHelper<DataTableFeatures, MessageCampaign>()

function CampaignLink({ campaign }: { campaign: MessageCampaign }) {
  const searchParams = useSearchParams()
  const query = searchParams.toString()
  return (
    <Link
      href={`/org/messaging/${campaign.id}${query ? `?${query}` : ""}`}
      className="block max-w-sm space-y-1"
    >
      <div className="flex items-center gap-2">
        <span className="font-semibold text-foreground">{campaign.name}</span>
        <StatusBadge
          status={MESSAGE_STATUS[campaign.status] ?? MESSAGE_STATUS.failed!}
          size="sm"
        />
      </div>
      <div className="truncate text-xs text-muted-foreground">
        {campaign.message}
      </div>
    </Link>
  )
}

function DeliveryStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-20 rounded-lg bg-secondary px-3 py-2 text-center">
      <div className="text-sm font-semibold text-foreground tabular-nums">
        {value}
      </div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  )
}

export const messageCampaignColumns = column.columns([
  column.accessor("name", {
    header: "Campaign",
    cell: ({ row }) => <CampaignLink campaign={row.original} />,
  }),
  column.display({
    id: "delivery",
    header: "Delivery",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <DeliveryStat label="Recipients" value={row.original.recipientCount} />
        <DeliveryStat label="Sent" value={row.original.sentCount} />
        <DeliveryStat label="Failed" value={row.original.failedCount} />
      </div>
    ),
  }),
  column.display({
    id: "date",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.original.sentAt ?? row.original.createdAt)}
      </span>
    ),
  }),
])
