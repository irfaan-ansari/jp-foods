import React from "react"

import { GridWrapper, PageContent, PageHeader } from "@/components/page-content"

import { FilterTab } from "@/components/filter-tabs"

import { SearchQueryParam } from "@jp/ui/components/jp"

import { TransactionCard } from "@/features/transaction/components/transaction-card"

const OPTIONS = [
  { label: "All", value: "" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
]

const TransactionsPage = async () => {
  return (
    <React.Fragment>
      <PageHeader title="Transactions" />
      <PageContent className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <FilterTab queryKey="role" tabs={OPTIONS} path="/team/orders/count" />

          <SearchQueryParam />
        </div>
        <GridWrapper>
          {[...Array(24)].map((_, i) => (
            <TransactionCard key={i} />
          ))}
        </GridWrapper>
      </PageContent>
    </React.Fragment>
  )
}

export default TransactionsPage
