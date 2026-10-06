"use client"
import { StatusBadge } from "@jp/ui/components/jp/status-badge"
import { useOrders } from "@/features/order/order.data"
import { STATUS } from "@/features/order/order.const"
import { CardDescription, CardTitle } from "@jp/ui/components/card"
import { formatDate, formatUSD } from "@jp/utils"
import React from "react"
import { DashboardCard } from "./dashboard-card"
import { Skeleton } from "@jp/ui/components/skeleton"

export const RecentOrders = () => {
  const { data, isPending } = useOrders({ limit: 5 })
  return (
    <DashboardCard title="Recent Orders">
      {isPending ? (
        [...Array(6)].map((_, i) => <Skeleton className="h-20" key={i} />)
      ) : (
        <div className="divide-y divide-dashed">
          {data?.data?.map((order) => (
            <div className="py-2">
              <div className="flex gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle>#{order.id}</CardTitle>
                    <StatusBadge
                      status={
                        STATUS[
                          order.status === "in_progress"
                            ? "processing"
                            : order.status
                        ] ?? STATUS.all!
                      }
                    />
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
      )}
    </DashboardCard>
  )
}
