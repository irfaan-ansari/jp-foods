import React from "react"
import { Buildings, Letter, Phone, User } from "@solar-icons/react"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"
import { CopyButton } from "@jp/ui/components/jp"
import { IconTile } from "@jp/ui/components/icon-tile"
import { Skeleton } from "@jp/ui/components/skeleton"

import { CustomerInvite } from "../customer.type"
import { INVITE_STATUS } from "../customer.const"
import { StatusBadge } from "@/components/status-badge"
import { formatDate } from "@jp/utils"

export const CustomerInviteCard = ({ data }: { data: CustomerInvite }) => {
  const map = INVITE_STATUS[data.status]! ?? {}
  return (
    <Card
      size="sm"
      className="relative h-full shadow-xs transition hover:-translate-y-0.5 hover:bg-secondary/40 hover:shadow-sm"
      style={{ "--icon-color": map.color } as React.CSSProperties}
    >
      <CardHeader className="gap-3">
        <div className="flex items-center gap-2">
          <IconTile variant="elevated">
            <Buildings className="size-4 text-(--icon-color)" />
          </IconTile>

          <CardTitle>{data.companyName}</CardTitle>
        </div>
        <div className="grid">
          <CopyButton
            prefix={<Phone className="size-3.5" />}
            value={data.phone ?? ""}
          />
          <CopyButton
            prefix={<Letter className="size-3.5 shrink-0" />}
            value={data.email}
          />
        </div>
        <CardAction>
          <CustomerInviteBadge status={data.status} />
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-t border-dashed" />
        <div className="flex gap-3 text-muted-foreground">
          <span className="text-xs">Invited: {formatDate(data.createdAt)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export const CustomerInviteCardSkeleton = () => {
  return (
    <Card size="sm" className="shadow-xs">
      <CardHeader>
        <div className="grid min-w-0 gap-1">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-t border-dashed" />
        <Skeleton className="h-4 w-full" />
      </CardContent>
    </Card>
  )
}

export const CustomerInviteBadge = ({
  status,
  className,
}: {
  status: string
  className?: string
}) => {
  const map = INVITE_STATUS[status]! ?? {}

  return <StatusBadge status={map} className={className} />
}
