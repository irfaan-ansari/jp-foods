"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { createColumnHelper } from "@tanstack/react-table"
import type { DataTableFeatures } from "@jp/ui/components/data-table"
import { formatDate, formatPhone, formatUSD } from "@jp/utils"
import type { Order } from "../order.type"
import { OrderStatusBadge } from "./order-card"
import { OrderDropdown } from "./order-dropdown"

const column = createColumnHelper<DataTableFeatures, Order>()

function OrderLink({ id }: { id: Order["id"] }) {
  const searchParams = useSearchParams()
  const query = searchParams.toString()
  return (
    <Link
      href={`/org/orders/${id}${query ? `?${query}` : ""}`}
      className="font-semibold text-foreground hover:underline"
    >
      #{id}
    </Link>
  )
}

function OrderFilterLink({
  filter,
  id,
  children,
}: {
  filter: "customer" | "user"
  id: string
  children: string
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
      className="font-medium text-foreground hover:underline"
      aria-label={`${active ? "Clear" : "Filter by"} ${filter === "customer" ? "customer" : "user"}: ${children}`}
    >
      {children}
    </Link>
  )
}

export const orderColumns = column.columns([
  column.accessor("id", {
    header: "Order",
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="flex gap-2">
          <OrderLink id={row.original.id} />
          <OrderStatusBadge status={row.original.status ?? ""} />
        </div>
        <div className="text-xs text-muted-foreground">
          {formatDate(row.original.createdAt)}
        </div>
      </div>
    ),
  }),
  column.accessor("team", {
    header: "Customer",
    cell: ({ row }) => (
      <div className="space-y-1">
        <OrderFilterLink filter="customer" id={row.original.team.id}>
          {row.original.team.name}
        </OrderFilterLink>
        <div className="text-xs text-muted-foreground">
          {formatPhone(row.original.team.phoneNumber)}
        </div>
      </div>
    ),
  }),
  column.display({
    id: "placedBy",
    header: "Placed by",
    cell: ({ row }) => (
      <div className="space-y-1">
        {row.original.user ? (
          <OrderFilterLink filter="user" id={row.original.user.id}>
            {row.original.user.name}
          </OrderFilterLink>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
        {row.original.user?.email && (
          <div className="text-xs text-muted-foreground">
            {row.original.user.email}
          </div>
        )}
      </div>
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
        {row.original.lineItemCount}
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
