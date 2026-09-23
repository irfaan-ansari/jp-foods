"use client"

import { useState, type ReactNode } from "react"
import { Button } from "@jp/ui/components/button"
import { Input } from "@jp/ui/components/input"
import {
  AppDialog,
  AppDialogClose,
  AppDialogContent,
  AppDialogDescription,
  AppDialogFooter,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogTrigger,
} from "@jp/ui/components/jp/app-dialog"
import { formatUSD } from "@jp/utils"
import type { OrderWithLineItems } from "../order.type"

import { Badge } from "@jp/ui/components/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@jp/ui/components/table"

export function OrderInvoiceDialog({
  order,
  children,
}: {
  order: OrderWithLineItems
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<OrderWithLineItems["lineItems"]>([])

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) setItems(order.lineItems.map((item) => ({ ...item })))
    setOpen(nextOpen)
  }

  const updateItem = (
    index: number,
    field: "quantity" | "price",
    value: string
  ) => {
    setItems((current) =>
      current.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    )
  }

  const validNumber = (value: string, positive = false) =>
    value.trim() !== "" &&
    Number.isFinite(Number(value)) &&
    (positive ? Number(value) > 0 : Number(value) >= 0)

  const calculatedItems = items.map((item) => {
    const valid = validNumber(item.quantity, true) && validNumber(item.price)
    const subtotal = valid ? Number(item.quantity) * Number(item.price) : 0
    const tax = item.isTaxable
      ? (subtotal * Number(item.taxRate ?? 0)) / 100
      : 0
    return { subtotal, tax, total: subtotal + tax }
  })
  const hasInvalidItems = items.some(
    (item) => !validNumber(item.quantity, true) || !validNumber(item.price)
  )
  const subtotal = calculatedItems.reduce((sum, item) => sum + item.subtotal, 0)
  const tax = calculatedItems.reduce((sum, item) => sum + item.tax, 0)
  const charges = items.length ? Number(order.charges?.amount ?? 0) : 0

  return (
    <AppDialog open={open} onOpenChange={handleOpenChange}>
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>
      <AppDialogContent className="max-h-[90vh] md:max-w-2xl">
        <AppDialogHeader>
          <AppDialogTitle className="text-base font-bold">
            Generate Invoice
          </AppDialogTitle>
          <AppDialogDescription>
            Order #{order.id} · {order.team?.name}. Review quantities and unit
            prices.
          </AppDialogDescription>
        </AppDialogHeader>

        <div className="no-scrollbar min-h-0 space-y-4 overflow-y-auto">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent">
                <TableHead className="px-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Product
                </TableHead>
                <TableHead className="text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Price
                </TableHead>
                <TableHead className="text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Quantity
                </TableHead>
                <TableHead className="pr-4 text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Total
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => {
                const isValid =
                  validNumber(item.quantity, true) && validNumber(item.price)
                return (
                  <TableRow key={item.id}>
                    <TableCell className="w-[60%] px-2 py-1.5">
                      <div className="truncate font-semibold text-foreground">
                        {item.title}
                      </div>
                      <Badge
                        className="h-4.5 rounded-lg text-xs"
                        variant="primary-light"
                      >
                        {item.itemCode}
                      </Badge>
                    </TableCell>
                    <TableCell className="w-28 px-2 py-1.5 text-right tabular-nums">
                      <Input
                        className="text-right tabular-nums"
                        aria-label={`Unit price ($) for ${item.title}`}
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={item.price}
                        aria-invalid={!validNumber(item.price)}
                        aria-describedby={
                          !validNumber(item.price)
                            ? "invoice-input-error"
                            : undefined
                        }
                        onChange={(event) =>
                          updateItem(index, "price", event.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell className="w-28 px-2 py-1.5 text-right tabular-nums">
                      <Input
                        className="text-right tabular-nums"
                        aria-label={`Quantity for ${item.title}`}
                        min="0"
                        step="any"
                        required
                        value={item.quantity}
                        aria-invalid={!validNumber(item.quantity, true)}
                        aria-describedby={
                          !validNumber(item.quantity, true)
                            ? "invoice-input-error"
                            : undefined
                        }
                        onChange={(event) =>
                          updateItem(index, "quantity", event.target.value)
                        }
                      />
                    </TableCell>

                    <TableCell className="py-1.5 pr-2 text-right font-semibold tabular-nums">
                      {isValid ? formatUSD(calculatedItems[index]!.total) : "—"}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        <dl className="space-y-2 rounded-2xl border bg-muted/50 p-4 text-sm tabular-nums">
          <div className="flex justify-between gap-4">
            <dt>Subtotal</dt>
            <dd>{hasInvalidItems ? "—" : formatUSD(subtotal)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Tax</dt>
            <dd>{hasInvalidItems ? "—" : formatUSD(tax)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>{order.charges?.type || "Additional charges"}</dt>
            <dd>{formatUSD(charges)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t pt-2 text-base font-bold">
            <dt>Total</dt>
            <dd>
              {hasInvalidItems ? "—" : formatUSD(subtotal + tax + charges)}
            </dd>
          </div>
        </dl>
        <AppDialogFooter>
          <AppDialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </AppDialogClose>

          <Button disabled>Generate Invoice</Button>
        </AppDialogFooter>
      </AppDialogContent>
    </AppDialog>
  )
}
