import React from "react"

import { PageContent, PageHeader } from "@/components/page-content"
import { Button } from "@jp/ui/components/button"
import { Plus } from "lucide-react"
import { FilterTab } from "@/components/filter-tabs"

import { OrderClient } from "@/features/order/components/order-client"
import { SearchQueryParam } from "@jp/ui/components/jp"
import Link from "next/link"

const OPTIONS = [
  { label: "All", value: "" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
]

const Orders = async () => {
  return (
    <React.Fragment>
      <PageHeader title="Orders">
        <Button asChild>
          <Link href="/create/all">
            <Plus />
            New Order
          </Link>
        </Button>
      </PageHeader>
      <PageContent className="space-y-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <FilterTab queryKey="status" tabs={OPTIONS} path="/orders/count" />

          <SearchQueryParam />
        </div>
        <OrderClient />
      </PageContent>
    </React.Fragment>
  )
}

export default Orders
