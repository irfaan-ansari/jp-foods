import React from "react"

import { GridWrapper, PageContent, PageHeader } from "@/components/page-content"
import { FilterTab } from "@/components/filter-tabs"

import { SearchQueryParam } from "@jp/ui/components/jp"
import { InvoiceCard } from "@/features/invoice/components/invoice-card"

import { STATUS } from "@/features/invoice/invoice.const"

const InvoicePage = async () => {
  return (
    <React.Fragment>
      <PageHeader title="Invoices" />
      <PageContent className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <FilterTab
            queryKey="role"
            tabs={Object.values(STATUS)}
            path="/orders/count"
          />

          <SearchQueryParam />
        </div>
        <GridWrapper>
          {[...Array(24)].map((_, i) => (
            <InvoiceCard key={i} />
          ))}
        </GridWrapper>
      </PageContent>
    </React.Fragment>
  )
}

export default InvoicePage
