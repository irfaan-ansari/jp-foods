"use client"

import React from "react"
import { Calendar, ChevronsUpDown, Plus } from "lucide-react"
import { Button } from "@jp/ui/components/button"
import { FilterTab } from "@/components/filter-tabs"
import { PageContent, PageHeader } from "@/components/page-content"
import { OrgAccess } from "@/features/auth/components/org-permission"
import { OrdersClient } from "@/features/org/order/components/orders-client"
import { SearchQueryParam } from "@jp/ui/components/jp/search-input"
import { STATUS } from "@/features/org/order/order.const"

const Orders = () => {
  return (
    <React.Fragment>
      <PageHeader title="Orders">
        <OrgAccess permission={{ order: ["create"] }}>
          {(disabled) => (
            <Button disabled={disabled}>
              <Plus /> New Order
            </Button>
          )}
        </OrgAccess>
      </PageHeader>

      <PageContent className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <FilterTab
            tabs={Object.values(STATUS)}
            path="/api/v1/org/orders/count"
          />
          <SearchQueryParam />
        </div>

        <OrdersClient />
      </PageContent>
    </React.Fragment>
  )
}

export default Orders
