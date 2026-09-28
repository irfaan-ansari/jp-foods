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
import { Badge } from "@jp/ui/components/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@jp/ui/components/table"

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

        <Card className="gap-0 pb-0 shadow-xs" size="sm">
          <CardHeader className="border-b">
            <CardTitle className="text-base font-bold">Order Items</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0 **:data-[slot=table-container]:rounded-none **:data-[slot=table-container]:border-none">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="px-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Product
                  </TableHead>
                  <TableHead className="text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Price
                  </TableHead>
                  <TableHead className="text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Quantity
                  </TableHead>
                  <TableHead className="text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Tax
                  </TableHead>
                  <TableHead className="pr-4 text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Total
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.lineItems?.length ? (
                  data.lineItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="px-2 py-1.5">
                        <div className="flex min-w-48 items-center gap-3">
                          <Avatar size="lg" className="shrink-0">
                            <AvatarImage src={item.image ?? ""} alt="" />
                            <AvatarFallback>
                              <ImageOff className="size-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 space-y-1">
                            <div className="font-semibold text-foreground">
                              {item.title}
                            </div>
                            <Badge
                              className="h-4.5 rounded-lg text-xs"
                              variant="primary-light"
                            >
                              {item.itemCode}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-2 py-1.5 text-right text-muted-foreground tabular-nums">
                        {formatUSD(item.price)}
                        {item.catchWeight && " " + item.uom}
                      </TableCell>
                      <TableCell className="px-2 py-1.5 text-right tabular-nums">
                        {item.unitQuantity} {item.uom}
                        {/* {item.unitName && (
                          <span className="ml-1 text-xs text-muted-foreground">
                            {item.unitName}
                          </span>
                        )} */}
                      </TableCell>
                      <TableCell className="px-2 py-1.5 text-right text-muted-foreground tabular-nums">
                        <div>{formatUSD(item.taxAmount ?? 0)}</div>
                        {Number(item.taxRate) > 0 && (
                          <div className="text-xs text-muted-foreground">
                            {item.taxRate}%
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="py-1.5 pr-2 text-right font-semibold tabular-nums">
                        {formatUSD(item.total ?? 0)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No line items.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
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
