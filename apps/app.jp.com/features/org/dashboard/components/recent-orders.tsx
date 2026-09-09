"use client"
import { StatusBadge } from "@/components/status-badge"
import { useOrders } from "@/features/org/order/order.data"
import { CardDescription, CardTitle } from "@jp/ui/components/card"
import { formatDate, formatUSD } from "@jp/utils"
import React from "react"
import { DashboardCard } from "./dashboard-card"

export const RecentOrders = () => {
  const { data } = useOrders({ limit: 5 })
  return (
    <DashboardCard title="Recent Orders">
      <div className="divide-y divide-dashed">
        {data?.data?.map((order) => (
          <div className="py-2">
            <div className="flex gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <CardTitle>#{order.id}</CardTitle>
                  <StatusBadge status={order.status as any} />
                </div>
                <CardDescription className="text-xs">
                  {formatDate(order.createdAt)}
                </CardDescription>
              </div>
              <div className="text-right text-base font-semibold">
                {formatUSD(order.total)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
