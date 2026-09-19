import React from "react"
import { Order } from "../order.type"
import { Button } from "@jp/ui/components/button"
import { formatUSD } from "@jp/utils"
import { QuestionCircle } from "@solar-icons/react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"
import { Download, ImageOff } from "lucide-react"
import { OrderTimeline } from "./order-timeline"
import { Avatar, AvatarFallback, AvatarImage } from "@jp/ui/components/avatar"
import { CopyButton } from "@jp/ui/components/jp"

export const OrderDetail = ({ data }: { data: Order }) => {
  return (
    <div className="grid gap-6 @5xl/page-content:grid-cols-3">
      <div className="min-w-0 space-y-6 break-all @5xl/page-content:col-span-2">
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

        <Card className="shadow-xs" size="sm">
          <CardHeader className="border-b border-dashed">
            <CardTitle className="text-base font-bold">Order Items</CardTitle>
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
              <p className="text-lg font-bold">Order Summary</p>
            </div>
            <div className="space-y-2 px-6">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Line Items</span> <span>{data.lineItemCount}</span>
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

            <div className="grid gap-2 px-6">
              <Button className="w-full" asChild>
                <a href={data.estimateUrl} target="_blank">
                  <Download /> Download Estimate
                </a>
              </Button>

              <Button className="w-full" variant="outline">
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
