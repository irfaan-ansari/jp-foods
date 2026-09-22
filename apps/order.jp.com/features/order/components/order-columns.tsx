"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { createColumnHelper } from "@tanstack/react-table"
import type { DataTableFeatures } from "@jp/ui/components/data-table"
import { Badge } from "@jp/ui/components/badge"
import { formatDate, formatUSD, pluralize } from "@jp/utils"
import { StatusBadge } from "@/components/status-badge"
import type { Orders } from "../order.type"
import { OrderDropdown } from "./order-dropdown"

const column = createColumnHelper<DataTableFeatures, Orders>()

function OrderLink({ id }: { id: Orders["id"] }) {
  const searchParams = useSearchParams()
  const query = searchParams.toString()
  return (
    <Link
      href={`/orders/${id}${query ? `?${query}` : ""}`}
      className="font-semibold text-foreground hover:underline"
    >
      #{id}
    </Link>
  )
}

export const getOrderColumns = (currentUserId?: string) =>
  column.columns([
    column.accessor("id", {
      header: "Order",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <OrderLink id={row.original.id} />
            <StatusBadge status={row.original.status} />
          </div>
          <div className="text-xs text-muted-foreground">
            {formatDate(row.original.createdAt)}
          </div>
        </div>
      ),
    }),
    column.display({
      id: "placedBy",
      header: "Placed by",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <span>{row.original.user?.name ?? "—"}</span>
            {currentUserId && row.original.user?.id === currentUserId && (
              <Badge variant="primary-light" size="sm">
                You
              </Badge>
            )}
          </div>
          {row.original.user?.email && (
            <div className="text-xs text-muted-foreground">
              {row.original.user.email}
            </div>
          )}
        </div>
      ),
    }),
    column.display({
      id: "items",
      header: "Items",
      cell: ({ row }) => (
        <span className="text-muted-foreground tabular-nums">
          {pluralize(
            row.original.lineItemsCount,
            `${row.original.lineItemsCount} item`
          )}
        </span>
      ),
    }),
    column.accessor("deliveryDate", {
      header: "Delivery",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="text-foreground">
            {row.original.deliveryDate
              ? formatDate(row.original.deliveryDate)
              : "Not scheduled"}
          </div>
          {row.original.deliveryWindow && (
            <div className="text-xs text-muted-foreground">
              {row.original.deliveryWindow}
            </div>
          )}
        </div>
      ),
    }),
    column.accessor("total", {
      header: () => <div className="text-right">Total</div>,
      cell: ({ row }) => (
        <div className="text-right font-semibold tabular-nums">
          {formatUSD(row.original.total)}
        </div>
      ),
    }),
    column.display({
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <OrderDropdown data={row.original} />
        </div>
      ),
    }),
  ])
