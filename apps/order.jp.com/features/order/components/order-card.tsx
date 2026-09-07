import React from "react"
import { Orders } from "../order.type"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"
import { formatDate, formatUSD } from "@jp/utils"
import Link from "next/link"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { StatusBadge } from "@/components/status-badge"
import { ArrowRight } from "lucide-react"
import { OrderDropdown } from "./order-dropdown"
import { Skeleton } from "@jp/ui/components/skeleton"

export const OrderCard = ({ data }: { data: Orders }) => {
  const { searchParams } = useRouterStuff()

  return (
    <Card
      size="sm"
      className="relative h-full shadow-xs transition hover:-translate-y-0.5 hover:bg-secondary/40 hover:shadow-sm"
    >
      <Link
        href={`/orders/${data.id}?${searchParams}`}
        className="absolute inset-0"
      />
      <CardHeader>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CardTitle>#{data.id}</CardTitle>
            <StatusBadge status={data.status} />
          </div>
          <CardDescription className="text-xs">
            {formatDate(data.createdAt)}
          </CardDescription>
        </div>
        <CardAction className="flex items-center gap-2">
          <OrderDropdown data={data} />
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-start gap-2">
          <div className="grid flex-1">
            <div className="flex-1">Items: {data.lineItemsCount}</div>
            <div>Overdue • #INV-1283</div>
          </div>
          <div className="text-right text-base font-semibold">
            {formatUSD(data.total)}
          </div>
        </div>
        <div className="border-t border-dashed" />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            {data.status === "completed" ? "Delivered" : "Delivery "}•{" "}
            {formatDate(data.deliveryDate)}
          </div>
          <ArrowRight className="ml-auto size-4 text-muted-foreground transition group-hover/card:translate-x-1" />
        </div>
      </CardContent>
    </Card>
  )
}

export const OrderCardSkeleton = () => {
  return (
    <Card
      size="sm"
      className="relative h-full shadow-xs transition hover:-translate-y-0.5 hover:bg-secondary/40 hover:shadow-sm"
    >
      <CardHeader className="flex flex-row">
        <div className="flex-1 space-y-1">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="ml-auto size-8" />
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex gap-1">
          <div className="grid gap-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="ml-auto h-5 w-24" />
        </div>
        <div className="border-t border-dashed" />
        <Skeleton className="h-5 w-full" />
      </CardContent>
    </Card>
  )
}
