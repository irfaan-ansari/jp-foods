"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { DataTable } from "@jp/ui/components/data-table"
import type { DataTableFeatures } from "@jp/ui/components/data-table"

type Statement = {
  id: string
  period: string
  issuedAt: string
  balance: string
  status: string
}

const column = createColumnHelper<DataTableFeatures, Statement>()

const columns = column.columns([
  column.accessor("id", {
    header: "Statement",
    cell: ({ row }) => (
      <span className="font-semibold text-foreground">{row.original.id}</span>
    ),
  }),
  column.accessor("period", {
    header: "Period",
  }),
  column.accessor("issuedAt", {
    header: "Issued",
  }),
  column.accessor("status", {
    header: "Status",
  }),
  column.accessor("balance", {
    header: () => <div className="text-right">Balance</div>,
    cell: ({ row }) => (
      <div className="text-right font-semibold tabular-nums">
        {row.original.balance}
      </div>
    ),
  }),
])

export const StatementClient = () => {
  return (
    <DataTable
      columns={columns}
      data={[]}
      getRowId={(statement) => statement.id}
      empty={{
        isEmpty: true,
        title: "No statements found.",
        description: "Monthly account statements will appear here.",
      }}
    />
  )
}
