import React from "react"
import { Buildings, Letter, MapPoint, Smartphone } from "@solar-icons/react"
import Link from "next/link"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"
import { CopyButton } from "@jp/ui/components/jp"
import { IconTile } from "@jp/ui/components/icon-tile"
import { Skeleton } from "@jp/ui/components/skeleton"

import { CustomerApplication } from "../customer.type"
import { APPLICATION_STATUS } from "../customer.const"
import { StatusBadge } from "@/components/status-badge"
import { formatDate } from "@jp/utils"

export const CustomerApplicationCard = ({
  data,
}: {
  data: CustomerApplication
}) => {
  const map = APPLICATION_STATUS[data.status]! ?? {}
  return (
    <Card
      size="sm"
      className="relative h-full shadow-xs transition hover:-translate-y-0.5 hover:bg-secondary/40 hover:shadow-sm"
      style={{ "--icon-color": map.color } as React.CSSProperties}
    >
      <Link href={`/crm/customers/${data.id}`} className="absolute inset-0" />
      <CardHeader>
        <div className="flex items-start gap-2">
          <IconTile variant="elevated">
            <Buildings className="size-4 text-(--icon-color)" />
          </IconTile>
          <div className="grid gap-1">
            <CardTitle>{data.companyName}</CardTitle>
            <CustomerApplicationBadge status={data.status} />
          </div>
        </div>
        <div className="mt-1 grid">
          <CopyButton
            prefix={<Smartphone className="size-3.5" />}
            value={data.companyPhone}
          />
          <CopyButton
            prefix={<Letter className="size-3.5 shrink-0" />}
            value={data.companyEmail}
          />
          <div className="flex items-center gap-1">
            <MapPoint className="size-3.5 shrink-0" />
            <span className="min-w-0 truncate text-muted-foreground">
              {data.companyState} {data.companyZip}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-t border-dashed" />
        <div className="grid grid-cols-1 gap-2">
          <div className="grid gap-0">
            <span className="text-xs font-medium text-muted-foreground">
              Contact
            </span>
            <span className="truncate">
              {data.officerFirst} {data.officerLast}
            </span>
          </div>
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

export const CustomerApplicationCardSkeleton = () => {
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
        <div className="grid grid-cols-1 gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="border-t border-dashed" />
        <Skeleton className="h-4 w-full" />
      </CardContent>
    </Card>
  )
}

export const CustomerApplicationBadge = ({
  status,
  className,
}: {
  status: string
  className?: string
}) => {
  const map = APPLICATION_STATUS[status]! ?? {}

  return <StatusBadge status={map} className={className} />
}
