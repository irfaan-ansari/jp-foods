"use client"

import React from "react"
import { Plus } from "lucide-react"
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
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <FilterTab
            tabs={Object.values(STATUS)}
            path="/org/orders/count"
            preserveQuery
          />
          <SearchQueryParam
            className="w-full max-w-none lg:max-w-xs"
            placeholder="Search orders..."
          />
        </div>

        <OrdersClient />
      </PageContent>
    </React.Fragment>
  )
}

export default Orders
