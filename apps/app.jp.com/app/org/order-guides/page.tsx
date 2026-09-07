"use client"
import React from "react"
import { Plus } from "lucide-react"
import { Button } from "@jp/ui/components/button"
import { FilterTab } from "@/components/filter-tabs"
import { SearchQueryParam } from "@jp/ui/components/jp"
import { PageContent, PageHeader } from "@/components/page-content"
import { OrgAccess } from "@/features/auth/components/org-permission"
import { OrderGuideClient } from "@/features/org/order-guide/components/order-guide-client"
import { OrderGuideDialog } from "@/features/org/order-guide/components/order-guide-dialog"

const OPTIONS = [{ label: "All", value: "", color: "#A1A1AA" }]

const OrderGuidePage = () => {
  return (
    <React.Fragment>
      <PageHeader title="Order Guides">
        <OrgAccess permission={{ orderGuide: ["create"] }}>
          {(disabled) => (
            <OrderGuideDialog>
              <Button disabled={disabled}>
                <Plus />
                Add New
              </Button>
            </OrderGuideDialog>
          )}
        </OrgAccess>
      </PageHeader>
      <PageContent className="space-y-6">
        <div className="flex gap-4">
          <FilterTab tabs={OPTIONS} path="/api/v1/org/order-guides/count" />
          <SearchQueryParam className="ml-auto" />
        </div>
        <OrderGuideClient />
      </PageContent>
    </React.Fragment>
  )
}

export default OrderGuidePage
