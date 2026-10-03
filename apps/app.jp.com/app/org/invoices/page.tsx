"use client"

import React from "react"
import { DataTable } from "@jp/ui/components/data-table"
import { PageContent, PageHeader } from "@/components/page-content"

import { invoiceColumns } from "@/features/org/invoice/components/invoice-columns"
import { DUMMY_INVOICES } from "@/features/org/invoice/invoice.const"

const InvoicePage = () => {
  return (
    <React.Fragment>
      <PageHeader title="Invoices" />
      <PageContent className="space-y-6">
        <DataTable
          columns={invoiceColumns}
          data={DUMMY_INVOICES}
          empty={{
            isEmpty: DUMMY_INVOICES.length === 0,
            title: "No invoices found.",
            description: "Issued invoices will appear here.",
          }}
        />
      </PageContent>
    </React.Fragment>
  )
}

export default InvoicePage
