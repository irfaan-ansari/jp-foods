"use client"

import { Box, ClipboardList, Inbox, RefreshCw, Users } from "lucide-react"
import { Button } from "@jp/ui/components/button"
import { IconTile } from "@jp/ui/components/icon-tile"
import { Skeleton } from "@jp/ui/components/skeleton"
import { PageContent, PageHeader } from "@/components/page-content"
import { QueryBoundary } from "@/components/query-boundry"
import { getDashboardCount } from "@/features/crm/dashboard/dashboard.utils"
import { useDashboard } from "../dashboard.data"
import { StatCard } from "./stat-card"
import { RecentOrders } from "./recent-orders"
import { OverviewChart } from "./overview"
import { OrderStatus } from "./order-status"
import { RankingCard } from "./ranking-card"

export function DashboardClient() {
  const dashboard = useDashboard()
  const { ordersCount, productsCount, customersCount, orders, insights } =
    dashboard
  const rankings = [
    {
      key: "topProducts",
      title: "Top Products",
      description: "By line-item subtotal · Excludes cancelled orders",
      money: true,
    },
    {
      key: "topCustomers",
      title: "Top Customers",
      description: "By order value · Excludes cancelled orders",
      money: true,
    },
    {
      key: "frequentlyOrdered",
      title: "Frequently Ordered",
      description: "By distinct orders · Excludes cancelled orders",
      money: false,
    },
    {
      key: "topCategories",
      title: "Top Categories",
      description: "By distinct orders · Excludes cancelled orders",
      money: false,
    },
  ] as const

  return (
    <>
      <PageHeader title="Dashboard">
        <Button
          variant="outline"
          disabled={dashboard.isFetching}
          onClick={() => void dashboard.refresh()}
        >
          <RefreshCw
            className={dashboard.isFetching ? "animate-spin" : undefined}
          />{" "}
          Refresh
        </Button>
      </PageHeader>
      <PageContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-6">
          {[
            {
              title: "Open Orders",
              query: ordersCount,
              status: "in_progress",
              icon: Inbox,
              color: "text-amber-500",
            },
            {
              title: "Orders Placed",
              query: ordersCount,
              status: "all",
              icon: ClipboardList,
              color: "text-rose-500",
            },
            {
              title: "Total Products",
              query: productsCount,
              status: "all",
              icon: Box,
              color: "text-sky-500",
            },
            {
              title: "Total Customers",
              query: customersCount,
              status: "all",
              icon: Users,
              color: "text-emerald-500",
            },
          ].map(({ title, query, status, icon: Icon, color }) => (
            <StatCard
              key={title}
              title={title}
              loading={query.isPending}
              value={
                query.isError
                  ? "—"
                  : getDashboardCount(query.data?.data[status]).toLocaleString()
              }
              description={
                query.isError ? "Unable to load · Refresh to retry" : "All-time"
              }
              icon={
                <IconTile variant="elevated">
                  <Icon className={`size-5 ${color}`} />
                </IconTile>
              }
            />
          ))}
        </div>
        <div className="grid items-start gap-4 lg:grid-cols-3 lg:gap-6">
          <OrderStatus
            data={ordersCount.data?.data ?? {}}
            loading={ordersCount.isPending}
            error={ordersCount.isError}
          >
            <RecentOrders
              orders={orders.data?.data ?? []}
              loading={orders.isPending}
              error={orders.isError}
            />
          </OrderStatus>
          {rankings.map(({ key, ...props }) => (
            <RankingCard
              key={key}
              {...props}
              rows={insights.data?.data[key] ?? []}
              loading={insights.isPending}
              error={insights.isError}
            />
          ))}
          <QueryBoundary
            query={insights}
            loading={<Skeleton className="h-80 rounded-xl" />}
          >
            {({ data }) => <OverviewChart data={data.overview} />}
          </QueryBoundary>
        </div>
      </PageContent>
    </>
  )
}
