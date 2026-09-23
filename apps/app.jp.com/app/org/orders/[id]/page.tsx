"use client"
import { PageContent, PageHeader } from "@/components/page-content"
import { useOrder } from "@/features/org/order/order.data"

import { OrderDropdown } from "@/features/org/order/components/order-dropdown"
import { OrderInvoiceDialog } from "@/features/org/order/components/order-invoice-dialog"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@jp/ui/components/table"

import { formatUSD } from "@jp/utils"
import { Buildings, MenuDots, User } from "@solar-icons/react"
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  ImageOff,
  Package,
  Truck,
} from "lucide-react"
import { useParams } from "next/navigation"
import React from "react"

import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { OrderStatusBadge } from "@/features/org/order/components/order-card"
import { useConfirm } from "@jp/ui/components/jp/confirm-dialog"
import { completeOrder } from "@/features/org/order/order.action"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { Tooltip } from "@jp/ui/components/jp"

const OrderPage = () => {
  const { id } = useParams()
  const { open } = useConfirm()
  const queryClient = useQueryClient()
  const { searchParams } = useRouterStuff()
  const { data: order, isPending, isError, error } = useOrder(id as string)
  const data = order?.data! ?? {}

  const handleComplete = () => {
    open({
      title: "Mark as completed",
      description:
        "This will mark the order as completed and update its status.",
      action: {
        action: async () => {
          const { serverError } = await completeOrder({
            id: data.id,
          })
          if (serverError) {
            toast.error(serverError.message)
          } else {
            queryClient.invalidateQueries({
              queryKey: ["orders"],
            })
          }
        },
      },
    })
  }

  return (
    <React.Fragment>
      <PageHeader
        loading={isPending}
        title="Back"
        backUrl={`/org/orders?${searchParams}`}
      />

      <PageContent loading={isPending} className="mx-auto max-w-7xl">
        {isError ? (
          <ErrorState title={error.message} description={error.description} />
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="min-w-0 space-y-6 lg:col-span-2">
              <div className="flex items-center gap-3">
                <span className="flex-1 text-base font-bold">
                  Order #{data.id}
                </span>
                <OrderStatusBadge status={data?.status ?? "all"} />
                <OrderDropdown data={data}>
                  <Button
                    size="icon"
                    variant="outline"
                    className="relative z-1"
                  >
                    <MenuDots />
                  </Button>
                </OrderDropdown>
                <Tooltip content="Previous Order">
                  <Button
                    size="icon"
                    variant="secondary"
                    disabled
                    className="border border-border"
                  >
                    <ChevronLeft />
                  </Button>
                </Tooltip>
                <Tooltip content="Next Order">
                  <Button
                    size="icon"
                    variant="secondary"
                    disabled
                    className="border border-border"
                  >
                    <ChevronRight />
                  </Button>
                </Tooltip>
              </div>
              {/* stats */}
              <div className="grid grid-cols-1 gap-3 @sm:grid-cols-3">
                <Card className="gap-4 overflow-visible bg-linear-to-b from-amber-50 p-4 shadow-xs">
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
                      {data.deliveryDate}
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">
                      {data.deliveryWindow}
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">
                      {data.deliveryInstruction}
                    </div>
                  </div>
                </Card>
                <Card className="gap-4 overflow-visible bg-linear-to-b from-green-50 p-4 shadow-xs">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle>Customer</CardTitle>
                    <Badge
                      className="ring-offset-backgrround size-9 rounded-lg ring-1 ring-border ring-offset-2"
                      variant="secondary"
                    >
                      <Buildings className="size-5 text-green-500" />
                    </Badge>
                  </div>

                  <div className="grid min-w-0 flex-1 truncate">
                    <span className="line-clamp-1 text-sm font-medium">
                      {data.team?.name}
                    </span>
                    <CopyButton value={data.team?.phoneNumber} />
                    <CopyButton value={data.team?.email} />
                  </div>
                </Card>
                <Card className="gap-4 overflow-visible bg-linear-to-b from-blue-50 p-4 shadow-xs">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle> Placed by</CardTitle>
                    <Badge
                      className="ring-offset-backgrround size-9 rounded-lg ring-1 ring-border ring-offset-2"
                      variant="secondary"
                    >
                      <User className="size-5 text-blue-500" />
                    </Badge>
                  </div>

                  <div className="grid min-w-0 flex-1 truncate">
                    <span className="line-clamp-1 truncate text-sm font-medium">
                      {data.user?.name}
                    </span>
                    <CopyButton value={data.user?.phoneNumber ?? ""} />
                    <CopyButton value={data.user?.email ?? ""} />
                  </div>
                </Card>
              </div>

              <Card className="gap-0 pb-0 shadow-xs" size="sm">
                <CardHeader className="border-b">
                  <CardTitle className="text-base font-bold">
                    Order Items
                  </CardTitle>
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
                              {formatUSD(item.price ?? 0)}
                            </TableCell>
                            <TableCell className="px-2 py-1.5 text-right tabular-nums">
                              {item.quantity}
                              {item.unitName && (
                                <span className="ml-1 text-xs text-muted-foreground">
                                  {item.unitName}
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="v text-right text-muted-foreground tabular-nums">
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
                      <OrderInvoiceDialog order={data}>
                        <Button className="w-full bg-invert hover:bg-invert/80">
                          <CheckCircle />
                          Generate Invoice
                        </Button>
                      </OrderInvoiceDialog>
                    )}
                    {data.status !== "completed" && (
                      <Button className="w-full" onClick={handleComplete}>
                        <CheckCircle />
                        Mark as Completed
                      </Button>
                    )}

                    <Button className="w-full" variant="outline" asChild>
                      <a
                        href={`/api/v1/org/orders/${data.id}/estimate`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download />
                        Download Estimate
                      </a>
                    </Button>
                    <Button className="w-full" variant="outline" asChild>
                      <a
                        href={`/api/v1/org/orders/${data.id}/slip`}
                        target="_blank"
                        rel="noopener noreferrer"
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
