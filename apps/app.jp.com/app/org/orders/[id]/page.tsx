"use client"
import { PageContent, PageHeader } from "@/components/page-content"
import { useOrder } from "@/features/org/order/order.data"

import { OrderDropdown } from "@/features/org/order/components/order-dropdown"
import { Avatar, AvatarFallback, AvatarImage } from "@jp/ui/components/avatar"
import { Badge } from "@jp/ui/components/badge"
import { Button } from "@jp/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"
import { CopyButton } from "@jp/ui/components/jp/copy-button"
import { ErrorState } from "@jp/ui/components/jp/empty-state"

import { formatUSD } from "@jp/utils"
import { Buildings, User } from "@solar-icons/react"
import {
  BadgeCheck,
  CheckCircle,
  Download,
  ImageOff,
  Package,
  Truck,
} from "lucide-react"
import { useParams } from "next/navigation"
import React from "react"

import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { OrderStatusBadge } from "@/features/org/order/components/order-card"

const OrderPage = () => {
  const { id } = useParams()
  const { searchParams } = useRouterStuff()
  const { data: order, isPending, isError, error } = useOrder(id as string)
  const data = order?.data! ?? {}

  return (
    <React.Fragment>
      <PageHeader
        loading={isPending}
        title={`#${data?.id}`}
        backUrl={`/org/orders?${searchParams}`}
      >
        <>
          <OrderStatusBadge status={data?.status ?? "all"} />
          <OrderDropdown data={data} />
        </>
      </PageHeader>
      <PageContent loading={isPending}>
        {isError ? (
          <ErrorState title={error.message} description={error.description} />
        ) : (
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 min-w-0 space-y-6 break-all">
              {/* stats */}
              <div className="grid grid-cols-1 gap-3 @sm:grid-cols-3">
                <Card className="gap-4 overflow-visible p-4 shadow-xs">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle>Delivery</CardTitle>
                    <Badge
                      className="ring-offset-backgrround size-9 rounded-lg ring-1 ring-border ring-offset-2"
                      variant="secondary"
                    >
                      <Truck className="size-5 text-amber-500" />
                    </Badge>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-muted-foreground">
                      {data.deliveryDate + " " + data.deliveryWindow}
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">
                      {data.deliveryInstruction}
                    </div>
                  </div>
                </Card>
                <Card className="gap-4 overflow-visible p-4 shadow-xs">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle>Customer</CardTitle>
                    <Badge
                      className="ring-offset-backgrround size-9 rounded-lg ring-1 ring-border ring-offset-2"
                      variant="secondary"
                    >
                      <Buildings className="size-5 text-green-500" />
                    </Badge>
                  </div>

                  <div className="min-w-0 flex-1 truncate">
                    <span className="line-clamp-1 text-sm font-medium">
                      {data.team?.name}
                    </span>
                    <CopyButton value={data.team?.phoneNumber} />
                    <CopyButton value={data.team?.email} />
                  </div>
                </Card>
                <Card className="gap-4 overflow-visible p-4 shadow-xs">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle> Placed by</CardTitle>
                    <Badge
                      className="ring-offset-backgrround size-9 rounded-lg ring-1 ring-border ring-offset-2"
                      variant="secondary"
                    >
                      <User className="size-5 text-blue-500" />
                    </Badge>
                  </div>

                  <div className="min-w-0 flex-1 truncate">
                    <span className="line-clamp-1 truncate text-sm font-medium">
                      {data.user?.name}
                    </span>
                    <CopyButton value={data.user?.phoneNumber ?? ""} />
                    <CopyButton value={data.user?.email ?? ""} />
                  </div>
                </Card>
              </div>

              <Card className="shadow-xs" size="sm">
                <CardHeader className="border-b border-dashed">
                  <CardTitle className="text-base font-bold">
                    Order Items
                  </CardTitle>
                </CardHeader>
                <CardContent className="divide-y divide-dashed px-0">
                  {data.lineItems?.map((item, i) => (
                    <div
                      className="flex gap-3 px-4 pb-2 not-first:pt-2"
                      key={item.id}
                    >
                      <Avatar size="lg">
                        <AvatarImage src={item.image!} />
                        <AvatarFallback>
                          <ImageOff className="size-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid min-w-0 flex-1 gap-0.5">
                        <p className="truncate font-semibold">{item.title}</p>
                        <CopyButton
                          value={item.itemCode ?? ""}
                          className="**:data-[slot=copy-value]:text-xs"
                        />
                      </div>
                      <div className="grid min-w-24 text-right">
                        <div className="font-semibold">
                          {formatUSD(item.total ?? 0)}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{formatUSD(item.price ?? 0)}</span>
                          <span>x</span>
                          <span>
                            {item.quantity}
                            {item.unitName && <span>/{item.unitName}</span>}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* summary card */}
            <div>
              <div className="sticky top-18 rounded-2xl border bg-secondary/50 shadow-xs">
                <div className="space-y-4 py-6 text-sm">
                  <div className="px-6">
                    <p className="text-base font-bold">Order Summary</p>
                  </div>
                  <div className="space-y-2 px-6">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Line Items</span> <span>{data.lineItemCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Quantity</span> <span>{data.lineItemQuantity}</span>
                    </div>
                  </div>
                  <div className="border-t-2" />
                  <div className="space-y-2 px-6">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Subtotal</span>{" "}
                      <span>{formatUSD(data.subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>
                        Tax{" "}
                        {Number(data.taxAmount) > 0 &&
                          data?.taxName &&
                          `(${data.taxName})`}
                      </span>
                      <span
                        className={`font-medium ${Number(data?.taxAmount) > 0 ? "text-red-700" : ""}`}
                      >
                        {formatUSD(data.taxAmount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>{data.charges?.type}</span>
                      <span
                        className={`font-medium ${Number(data.charges?.amount) > 0 ? "text-red-700" : ""}`}
                      >
                        {formatUSD(data.charges?.amount ?? 0)}
                      </span>
                    </div>
                  </div>
                  <div className="border-t-2" />

                  <div className="flex items-center justify-between px-6 text-base font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      {formatUSD(data.total)}
                    </span>
                  </div>

                  <div className="grid gap-2 px-6">
                    {data.status !== "completed" && (
                      <Button className="w-full">
                        <CheckCircle />
                        Mark as Completed
                      </Button>
                    )}

                    <Button className="w-full" variant="outline" asChild>
                      <a
                        href={`/api/v1/org/orders/${data.id}/estimate`}
                        target="_blank"
                      >
                        <Download />
                        Download Estimate
                      </a>
                    </Button>
                    <Button className="w-full" variant="outline" asChild>
                      <a
                        href={`/api/v1/org/orders//${data.id}/slip`}
                        target="_blank"
                      >
                        <Package />
                        Packing Slip
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </PageContent>
    </React.Fragment>
  )
}

export default OrderPage
