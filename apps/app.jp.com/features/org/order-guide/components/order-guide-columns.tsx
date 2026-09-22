"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { ImageOff } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@jp/ui/components/avatar"
import type { DataTableFeatures } from "@jp/ui/components/data-table"
import { formatDate } from "@jp/utils"
import type { OrderGuide } from "../order-guide.type"
import { OrderGuideDropdown } from "./order-guide-dropdown"

const column = createColumnHelper<DataTableFeatures, OrderGuide>()

export const orderGuideColumns = column.columns([
  column.accessor("name", {
    header: "Order guide",
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="font-semibold text-foreground">{row.original.name}</div>
        {row.original.description && (
          <div className="max-w-64 truncate text-xs text-muted-foreground">
            {row.original.description}
          </div>
        )}
      </div>
    ),
  }),
  column.display({
    id: "customer",
    header: "Customer",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.team?.name ?? "All customers"}
      </span>
    ),
  }),
  column.display({
    id: "products",
    header: "Products",
    cell: ({ row }) => (
      <div className="flex min-w-36 items-center gap-2">
        <div className="flex -space-x-2">
          {row.original.products.slice(0, 4).map((product) => (
            <Avatar
              key={product.id}
              className="size-7 border-2 border-background"
            >
              <AvatarImage src={product.image ?? ""} alt={product.title} />
              <AvatarFallback>
                <ImageOff className="size-3" />
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          {row.original.products.length} items
        </span>
      </div>
    ),
  }),
  column.accessor("updatedAt", {
    header: "Last updated",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.original.updatedAt)}
      </span>
    ),
  }),
  column.display({
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <OrderGuideDropdown data={row.original} />
      </div>
    ),
  }),
])
