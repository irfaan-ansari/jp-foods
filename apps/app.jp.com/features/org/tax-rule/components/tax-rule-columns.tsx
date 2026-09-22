"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { Badge } from "@jp/ui/components/badge"
import type { DataTableFeatures } from "@jp/ui/components/data-table"
import { formatDate } from "@jp/utils"
import type { TaxRule } from "../tax-rule.type"
import { TaxRuleDropdown } from "./tax-rule-dropdown"

const column = createColumnHelper<DataTableFeatures, TaxRule>()

export const taxRuleColumns = column.columns([
  column.accessor("name", {
    header: "Tax rule",
    cell: ({ row }) => (
      <div className="flex min-w-48 items-center gap-2">
        <span className="font-semibold text-foreground">
          {row.original.name}
        </span>
        <Badge variant="warning-light" className="font-semibold">
          {row.original.rate}%
        </Badge>
      </div>
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
        <TaxRuleDropdown data={row.original} />
      </div>
    ),
  }),
])
