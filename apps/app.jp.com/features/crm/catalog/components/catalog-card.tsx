import React from "react"
import { Buildings, Global, Letter, Smartphone, User } from "@solar-icons/react"

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"
import { CopyButton } from "@jp/ui/components/jp"
import { IconTile } from "@jp/ui/components/icon-tile"
import { Skeleton } from "@jp/ui/components/skeleton"

import { StatusBadge } from "@/components/status-badge"
import { formatDate } from "@jp/utils"
import { STATUS } from "../catalog.const"
import { CatalogInquiry } from "../catalog.type"
import { CatalogDropdown } from "./catalog-dropdown"

export const CatalogInquiryCard = ({ data }: { data: CatalogInquiry }) => {
  const map = STATUS[data.status]! ?? {}
  return (
    <Card
      size="sm"
      className="relative h-full gap-2 shadow-xs transition hover:-translate-y-0.5 hover:bg-secondary/40 hover:shadow-sm"
      style={{ "--icon-color": map.color } as React.CSSProperties}
    >
      <CardHeader>
        <div className="flex items-start gap-2">
          <IconTile variant="elevated">
            <Buildings className="size-4 text-(--icon-color)" />
          </IconTile>
          <div className="grid gap-1">
            <CardTitle>{data.companyName}</CardTitle>
            <CatalogInquiryBadge status={data.status} />
          </div>
        </div>
        <CardAction>
          <CatalogDropdown data={data} />
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid">
          <div className="flex items-center gap-1">
            <User className="size-3.5 shrink-0" />
            <span className="text-muted-foreground">
              {data.firstName} {data.lastName}
            </span>
          </div>
          <CopyButton
            prefix={<Smartphone className="size-3.5" />}
            value={data.phone ?? ""}
          />
          <CopyButton
            prefix={<Letter className="size-3.5 shrink-0" />}
            value={data.email}
          />

          {data.status === "approved" && data.url && (
            <CopyButton
              prefix={<Global className="size-3.5 shrink-0" />}
              value={data.url}
            />
          )}
        </div>
        <div className="border-t border-dashed" />
        <div className="flex gap-3 text-muted-foreground">
          <span className="text-xs">
            Applied • {formatDate(data.createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export const CatalogInquiryCardSkeleton = () => {
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

export const CatalogInquiryBadge = ({
  status,
  className,
}: {
  status: string
  className?: string
}) => {
  const map = STATUS[status]! ?? STATUS["approved"]

  return <StatusBadge status={map} className={className} />
}
