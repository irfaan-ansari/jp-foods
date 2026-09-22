"use client"

import { createColumnHelper } from "@tanstack/react-table"
import type { DataTableFeatures } from "@jp/ui/components/data-table"
import { formatDate } from "@jp/utils"
import { StatusBadge } from "@/components/status-badge"
import type { PriceLevel } from "../price-level.type"
import { STATUS } from "../price-level.const"
import { PriceLevelBadge } from "./price-level-card"
import { PriceLevelDropdown } from "./price-level-dropdown"

const column = createColumnHelper<DataTableFeatures, PriceLevel>()

export const priceLevelColumns = column.columns([
  column.accessor("name", {
    header: "Price level",
    cell: ({ row }) => (
      <div className="flex min-w-48 items-center gap-2">
        <span className="font-semibold text-foreground">
          {row.original.name}
        </span>
        <StatusBadge status={STATUS[row.original.status] ?? STATUS.inactive!} />
      </div>
    ),
  }),
  column.display({
    id: "adjustment",
    header: "Adjustment",
    cell: ({ row }) => (
      <PriceLevelBadge
        adjustmentType={row.original.adjustmentType}
        adjustmentValue={row.original.adjustmentValue ?? 0}
        appliesTo={row.original.appliesTo}
        productCount={row.original.productCount}
      />
    ),
  }),
  column.accessor("customerCount", {
    header: "Customers",
    cell: ({ row }) => (
      <span className="text-muted-foreground tabular-nums">
        {row.original.customerCount}
      </span>
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
        <PriceLevelDropdown data={row.original} />
      </div>
    ),
  }),
])
