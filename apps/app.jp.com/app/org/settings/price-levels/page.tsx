"use client"
import React from "react"
import { Plus } from "lucide-react"
import { Button } from "@jp/ui/components/button"
import { PageContent, PageHeader } from "@/components/page-content"
import { PriceLevelDialog } from "@/features/org/price-level/components/price-level-dialog"
import { PriceLevelClient } from "@/features/org/price-level/components/price-level-client"
import { OrgAccess } from "@/features/auth/components/org-permission"
import { FilterTab } from "@/components/filter-tabs"
import { SearchQueryParam } from "@jp/ui/components/jp/search-input"

const OPTIONS = [
  { label: "All", value: "", color: "#A1A1AA" },
  { label: "Active", value: "active", color: "#22C55E" },
  { label: "Inactive", value: "inactive", color: "#F59E0B" },
]

const PriceListPage = () => {
  return (
    <React.Fragment>
      <PageHeader title="Price Levels">
        <OrgAccess permission={{ priceLevel: ["create"] }}>
          {(disabled) => (
            <PriceLevelDialog>
              <Button disabled={disabled}>
                <Plus />
                Add New
              </Button>
            </PriceLevelDialog>
          )}
        </OrgAccess>
      </PageHeader>
      <PageContent className="space-y-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <FilterTab tabs={OPTIONS} path="/org/price-levels/count" />
          <SearchQueryParam
            className="w-full max-w-none lg:max-w-xs"
            placeholder="Search price levels..."
          />
        </div>
        <PriceLevelClient />
      </PageContent>
    </React.Fragment>
  )
}

export default PriceListPage
