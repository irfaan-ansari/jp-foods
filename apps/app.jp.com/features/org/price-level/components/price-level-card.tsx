"use client"
import React from "react"
import { Tag } from "@solar-icons/react"
import { formatDate, pluralize } from "@jp/utils"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"
import { Badge } from "@jp/ui/components/badge"
import { Skeleton } from "@jp/ui/components/skeleton"

import {
  PriceLevel,
  type PriceLevelBadge as PriceLevelBadgeProps,
} from "../price-level.type"
import { StatusBadge } from "@/components/status-badge"
import { PriceLevelDropdown } from "./price-level-dropdown"
import { STATUS } from "../price-level.const"

export const PriceLevelCard = ({ data }: { data: PriceLevel }) => {
  return (
    <Card
      size="sm"
      className="h-full shadow-xs transition hover:-translate-y-0.5 hover:bg-secondary/40 hover:shadow-sm"
    >
      <CardHeader className="relative">
        <div className="space-y-1">
          <CardTitle>{data.name}</CardTitle>
        </div>
        <CardAction className="absolute top-0 right-4 flex items-center gap-2">
          <PriceLevelStatusBadge status={data.status} />
          <PriceLevelDropdown data={data} />
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-1">
        <CardDescription>
          Assigned to{" "}
          {pluralize(data.customerCount, `${data.customerCount} account`)}
        </CardDescription>
        <PriceLevelBadge
          adjustmentType={data.adjustmentType}
          adjustmentValue={data.adjustmentValue!}
          appliesTo={data.appliesTo}
          productCount={data.productCount}
        />
        <div className="my-4 border-t border-dashed" />
        <div className="text-muted-foreground">
          Last updated • {formatDate(data.updatedAt)}
        </div>
      </CardContent>
    </Card>
  )
}

export const PriceLevelSkeleton = () => {
  return (
    <Card className="shadow-xs" size="sm">
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-3/5" />

        <div className="space-y-1.5">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-4 w-4/5" />
        </div>

        <Skeleton className="h-4 w-full" />
      </CardContent>
    </Card>
  )
}

function PriceLevelBadge({
  appliesTo,
  adjustmentType,
  adjustmentValue,
  productCount,
}: PriceLevelBadgeProps) {
  if (appliesTo === "per_item") {
    return (
      <Badge variant="warning-light">
        <Tag /> {productCount ?? 0} {pluralize(productCount ?? 0, "Product")}
      </Badge>
    )
  }

  const positive = Number(adjustmentValue) >= 0

  const value =
    adjustmentType === "percentage"
      ? `${positive ? "+ " : "- "}${adjustmentValue}%`
      : `${positive ? "+ " : "- "}$${Math.abs(Number(adjustmentValue)).toFixed(2)}`

  return (
    <Badge variant={positive ? "success-light" : "destructive-light"}>
      {value} • All items
    </Badge>
  )
}

const PriceLevelStatusBadge = ({ status }: { status: string }) => {
  const map = STATUS[status]! ?? {}
  return <StatusBadge status={map} className="backdrop-blur-lg" />
}
