import React from "react"
import Link from "next/link"
import { Order } from "../order.type"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"
import { StatusBadge } from "@/components/status-badge"
import { Phone } from "@solar-icons/react"
import { CopyButton } from "@jp/ui/components/jp"
import { formatDate, formatPhone, formatUSD } from "@jp/utils"
import { OrderDropdown } from "./order-dropdown"
import { Skeleton } from "@jp/ui/components/skeleton"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { STATUS } from "../order.const"

export const OrderCard = ({ data }: { data: Order }) => {
  const { searchParams } = useRouterStuff()
  return (
    <Card
      size="sm"
      className="relative h-full shadow-xs transition hover:-translate-y-0.5 hover:bg-secondary/40 hover:shadow-sm"
    >
      <Link
        href={`/org/orders/${data.id}?${searchParams}`}
        className="absolute inset-0"
      />
      <CardHeader>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CardTitle>#{data.id}</CardTitle>
            <OrderStatusBadge status={data.status ?? ""} />
          </div>
          <CardDescription className="text-xs">
            {formatDate(data.createdAt)}
          </CardDescription>
        </div>
        <CardAction className="flex items-center gap-2">
          <div className="text-right text-base font-semibold">
            {formatUSD(data.total)}
          </div>
          <OrderDropdown data={data} />
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-start gap-2">
          <div>
            <p className="font-medium">{data.team.name}</p>
            <CopyButton
              prefix={<Phone className="size-3.5 shrink-0" />}
              className="**:data-[slot=copy-value]:text-xs"
              value={formatPhone(data.team.phoneNumber)}
            />
          </div>
        </div>
        <div className="border-t border-dashed" />
        <div className="mt-2 flex items-center gap-2 text-muted-foreground">
          {data.status === "completed " ? "Delivered" : "Delivery "}•
          {formatDate(data.deliveryDate)}
        </div>
      </CardContent>
    </Card>
  )
}

export const OrderSkeleton = () => {
  return (
    <Card size="sm" className="shadow-none">
      <CardHeader className="relative">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="mt-4 h-4 w-2/4" />
        <Skeleton className="mt-4 h-4 w-full" />
        <Skeleton className="absolute top-0 right-4 size-8" />
      </CardHeader>
    </Card>
  )
}

export const OrderStatusBadge = ({ status }: { status: string }) => {
  const map = STATUS[status]! ?? {}
  return <StatusBadge status={map} />
}
