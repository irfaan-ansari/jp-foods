import React from "react"
import { Order } from "../order.type"
import { Button } from "@jp/ui/components/button"
import { formatUSD } from "@jp/utils"
import { CheckCircle, Download, QuestionCircle } from "@solar-icons/react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"
import { Badge } from "@jp/ui/components/badge"
import { ImageOff, Loader2, Truck } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@jp/ui/components/avatar"
import { OrderTimeline } from "./order-timeline"

export const OrderDetail = ({ data }: { data: Order }) => {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 min-w-0 space-y-6 break-all">
        {/* stats */}
        <Card className="shadow-none">
          <CardContent className="">
            <OrderTimeline
              data={{
                status: data.status,
                createdAt: data.createdAt!,
                processingAt: data.createdAt!,
                deliveryDate: data.deliveryDate!,
                deliveredAt: data.deliveredAt!,
                cancelledAt: data.cancelledAt!,
                cancelReason: data.cancelReason!,
              }}
            />
          </CardContent>
        </Card>
        <Card className="gap-4 overflow-visible p-4 shadow-xs">
          <Badge
            className="ring-offset-backgrround size-9 ring-1 ring-border ring-offset-2"
            variant="secondary"
          >
            <Truck className="size-5 text-amber-500" />
          </Badge>
          <div className="min-w-0 flex-1">
            <CardTitle className="mb-2 text-xs font-semibold text-muted-foreground uppercase">
              Delivery
            </CardTitle>
            <div className="text-sm font-medium text-muted-foreground">
              {data.deliveryDate + " " + data.deliveryWindow}
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              {data.deliveryInstruction}
            </div>
          </div>
        </Card>

        <Card className="shadow-xs" size="sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Order Items</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-dashed">
            {data.lineItems.map((item, i) => (
              <div
                className="flex gap-3 not-first:pt-2 not-last:pb-2"
                key={item.id}
              >
                <Avatar
                  className="rounded-lg *:rounded-lg! data-[size=lg]:size-12"
                  size="lg"
                >
                  <AvatarImage src={item.image!} />
                  <AvatarFallback>
                    <ImageOff className="size-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 gap-1">
                  <p className="truncate text-sm font-semibold">{item.title}</p>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <p className="truncate font-medium">
                      {formatUSD(item.price!)} x {item.quantity}
                      {item.unit && "/" + item.unit}
                    </p>
                    |
                    <p className="font-medium">
                      Tax • {formatUSD(item.taxAmount ?? 0)}
                    </p>
                  </div>
                </div>
                <div className="ml-auto min-w-24 text-right text-base font-bold">
                  {formatUSD(item.total ?? 0)}
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
              <p className="text-lg font-bold">Order Summary</p>
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
                <span>Subtotal</span> <span>{formatUSD(data.subtotal)}</span>
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
              <span className="text-primary">{formatUSD(data.total)}</span>
            </div>

            <div className="grid gap-3 px-6">
              <Button className="w-full">
                <QuestionCircle />
                Need Help
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
