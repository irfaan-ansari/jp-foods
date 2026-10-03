"use client"

import { createColumnHelper } from "@tanstack/react-table"
import type { DataTableFeatures } from "@jp/ui/components/data-table"
import { formatDate, formatUSD } from "@jp/utils"
import { StatusBadge } from "@/components/status-badge"
import { STATUS } from "../invoice.const"
import type { InvoiceRow } from "../invoice.type"

const column = createColumnHelper<DataTableFeatures, InvoiceRow>()

export const invoiceColumns = column.columns([
  column.accessor("number", {
    header: "Invoice",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-semibold text-foreground">
          {row.original.number}
        </span>
        <StatusBadge status={STATUS[row.original.status]} />
      </div>
    ),
  }),
  column.accessor("customer", {
    header: "Customer",
  }),
  column.accessor("issuedAt", {
    header: "Issued",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.original.issuedAt)}
      </span>
    ),
  }),
  column.accessor("dueDate", {
    header: "Due",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.original.dueDate)}
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
])
