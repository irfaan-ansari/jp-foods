import React from "react"
import { SearchQueryParam } from "@jp/ui/components/jp"

const Orders = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-4">
        <div className="flex-1 space-y-0">
          <h1 className="text-xl font-semibold">Products</h1>
          <p className="text-sm/relaxed">Manage orders and deliveries</p>
        </div>
        <SearchQueryParam />
      </div>
    </div>
  )
}

export default Orders
