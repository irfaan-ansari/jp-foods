"use client"

import { createColumnHelper } from "@tanstack/react-table"
import type { DataTableFeatures } from "@jp/ui/components/data-table"
import { formatDate, formatUSD } from "@jp/utils"
import { StatusBadge } from "@jp/ui/components/jp/status-badge"
import { STATUS } from "../return.const"
import type { ReturnRow } from "../return.type"

const column = createColumnHelper<DataTableFeatures, ReturnRow>()

export const returnColumns = column.columns([
  column.accessor("number", {
    header: "Return",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-semibold text-foreground">
          {row.original.number}
        </span>
        <StatusBadge status={STATUS[row.original.status]} />
      </div>
    ),
  }),
  column.accessor("order", {
    header: "Order",
  }),
  column.accessor("customer", {
    header: "Customer",
  }),
  column.accessor("createdAt", {
    header: "Created",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.original.createdAt)}
      </span>
    ),
  }),
  column.accessor("amount", {
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => (
      <div className="text-right font-semibold tabular-nums">
        {formatUSD(row.original.amount)}
      </div>
    ),
  }),
])
