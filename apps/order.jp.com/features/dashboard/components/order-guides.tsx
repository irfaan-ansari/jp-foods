"use client"
import { StatusBadge } from "@/components/status-badge"
import { useOrders } from "@/features/order/order.data"
import { CardDescription, CardTitle } from "@jp/ui/components/card"
import { formatDate, formatUSD } from "@jp/utils"
import React from "react"
import { DashboardCard } from "./dashboard-card"
import { useInfiniteGuides } from "@/features/order-guide/guide.data"

export const OrderGuides = () => {
  const { data } = useInfiniteGuides({ limit: 5 })
  const orders = data?.pages.flatMap((o) => o.data)

  return (
    <DashboardCard title="Recent Orders">
      <div className="divide-y divide-dashed">
        {orders?.map((order) => (
          <div className="py-2">
            <div className="flex gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <CardTitle>{order.name}</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  {formatDate(order.createdAt)}
                </CardDescription>
              </div>
              <div className="text-right text-base font-semibold">
                {formatUSD(order.items.length)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
