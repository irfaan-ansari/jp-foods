import React from "react"

import { GridWrapper, PageContent, PageHeader } from "@/components/page-content"
import { Button } from "@jp/ui/components/button"
import { Plus } from "lucide-react"
import { FilterTab } from "@/components/filter-tabs"

import { OrderClient } from "@/features/order/components/order-client"
import { SearchQueryParam } from "@jp/ui/components/jp"
import { InvoiceCard } from "@/features/invoice/components/invoice-card"

const OPTIONS = [
  { label: "All", value: "" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
]

const InvoicePage = async () => {
  return (
    <React.Fragment>
      <PageHeader title="Invoices" />
      <PageContent className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <FilterTab queryKey="role" tabs={OPTIONS} path="/orders/count" />

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
