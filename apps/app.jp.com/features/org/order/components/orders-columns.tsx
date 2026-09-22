"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { createColumnHelper } from "@tanstack/react-table"
import type { DataTableFeatures } from "@jp/ui/components/data-table"
import { formatDate, formatPhone, formatUSD, pluralize } from "@jp/utils"
import type { Order } from "../order.type"
import { OrderStatusBadge } from "./order-card"
import { OrderDropdown } from "./order-dropdown"

const column = createColumnHelper<DataTableFeatures, Order>()

function OrderLink({ order }: { order: Order }) {
  const searchParams = useSearchParams()
  const query = searchParams.toString()
  return (
    <Link
      href={`/org/orders/${order.id}${query ? `?${query}` : ""}`}
      className="block space-y-1"
    >
      <div className="flex items-center gap-2">
        <span className="font-semibold text-foreground">#{order.id}</span>
        <OrderStatusBadge status={order.status ?? ""} />
      </div>
      <div className="text-xs text-muted-foreground">
        {formatDate(order.createdAt)}
      </div>
    </Link>
  )
}

function OrderFilterLink({
  filter,
  id,
  children,
  description,
}: {
  filter: "customer" | "user"
  id: string
  children: string
  description?: string
}) {
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams.toString())
  const active = params.get(filter) === id
  if (active) params.delete(filter)
  else params.set(filter, id)
  params.set("page", "1")

  return (
    <Link
      href={`/org/orders?${params.toString()}`}
      className="block"
      aria-label={`${active ? "Clear" : "Filter by"} ${filter === "customer" ? "customer" : "user"}: ${children}`}
    >
      <span className="font-medium text-foreground">{children}</span>
      {description && (
        <div className="text-xs text-muted-foreground">{description}</div>
      )}
    </Link>
  )
}

export const orderColumns = column.columns([
  column.accessor("id", {
    header: "Order",
    cell: ({ row }) => <OrderLink order={row.original} />,
  }),
  column.accessor("team", {
    header: "Customer",
    cell: ({ row }) => (
      <OrderFilterLink
        filter="customer"
        id={row.original.team.id}
        description={formatPhone(row.original.team.phoneNumber)}
      >
        {row.original.team.name}
      </OrderFilterLink>
    ),
  }),
  column.display({
    id: "placedBy",
    header: "Placed by",
    cell: ({ row }) =>
      row.original.user ? (
        <OrderFilterLink
          filter="user"
          id={row.original.user.id}
          description={row.original.user.email}
        >
          {row.original.user.name}
        </OrderFilterLink>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  }),
  column.accessor("deliveryDate", {
    header: "Delivery",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.deliveryDate
          ? formatDate(row.original.deliveryDate)
          : "—"}
      </span>
    ),
  }),
  column.display({
    id: "lineItemCount",
    header: "Items",
    cell: ({ row }) => (
      <span className="text-muted-foreground tabular-nums">
        {pluralize(
          row.original.lineItemCount,
          `${row.original.lineItemCount} item`
        )}
      </span>
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
