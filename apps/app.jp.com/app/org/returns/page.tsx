"use client"

import React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable, type DataTableFeatures } from "@jp/ui/components/data-table"
import { PageContent, PageHeader } from "@/components/page-content"

type ReturnRow = {
  number: string
  order: string
  customer: string
  createdAt: string
  amount: string
  status: string
}

const returnColumns: ColumnDef<DataTableFeatures, ReturnRow>[] = [
  { accessorKey: "number", header: "Return" },
  { accessorKey: "order", header: "Order" },
  { accessorKey: "customer", header: "Customer" },
  { accessorKey: "createdAt", header: "Created" },
  { accessorKey: "amount", header: "Amount" },
  { accessorKey: "status", header: "Status" },
]

const ReturnsPage = () => {
  return (
    <React.Fragment>
      <PageHeader title="Returns" />
      <PageContent className="space-y-6">
        <DataTable
          columns={returnColumns}
          data={[]}
          empty={{
            isEmpty: true,
            title: "No returns found.",
            description: "Returns will appear here when they are created.",
          }}
        />
      </PageContent>
    </React.Fragment>
  )
}

export default ReturnsPage
