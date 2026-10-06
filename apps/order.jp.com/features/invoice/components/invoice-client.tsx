"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { DataTable } from "@jp/ui/components/data-table"
import type { DataTableFeatures } from "@jp/ui/components/data-table"

type Invoice = {
  id: string
  issuedAt: string
  dueAt: string
  status: string
  total: string
}

const column = createColumnHelper<DataTableFeatures, Invoice>()

const columns = column.columns([
  column.accessor("id", {
    header: "Invoice",
    cell: ({ row }) => (
      <span className="font-semibold text-foreground">{row.original.id}</span>
    ),
  }),
  column.accessor("issuedAt", {
    header: "Issued",
  }),
  column.accessor("dueAt", {
    header: "Due",
  }),
  column.accessor("status", {
    header: "Status",
  }),
  column.accessor("total", {
    header: () => <div className="text-right">Total</div>,
    cell: ({ row }) => (
      <div className="text-right font-semibold tabular-nums">
        {row.original.total}
      </div>
    ),
  }),
])

export const InvoiceClient = () => {
  return (
    <DataTable
      columns={columns}
      data={[]}
      getRowId={(invoice) => invoice.id}
      empty={{
        isEmpty: true,
        title: "No invoices found.",
        description: "Invoices will appear here when they are available.",
      }}
    />
  )
}
