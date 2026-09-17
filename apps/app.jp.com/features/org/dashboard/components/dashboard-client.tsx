"use client"

import { Button } from "@jp/ui/components/button"
import { IconTile } from "@jp/ui/components/icon-tile"
import { Skeleton } from "@jp/ui/components/skeleton"
import { useDashboard } from "../dashboard.data"
import { StatCard } from "./stat-card"
import { RecentOrders } from "./recent-orders"
import { OverviewChart } from "./overview"
import { RankingCard } from "./ranking-card"
import { QueryBoundary } from "@/components/query-boundry"
import { PageContent, PageHeader } from "@/components/page-content"
import { getDashboardCount } from "@/features/crm/dashboard/dashboard.utils"
import { Box, ClipboardList, Inbox, RefreshCw, Users } from "lucide-react"
import React from "react"
import CRMDashboardCard from "@/features/crm/dashboard/components/dashboard-card"
import { STATUS } from "../../order/order.const"
import { DashboardCard } from "./dashboard-card"

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

  const stats = [
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
  ] as const

  return (
    <React.Fragment>
      <PageHeader title="Dashboard">
        <Button
          variant="outline"
          disabled={dashboard.isFetching}
          onClick={() => void dashboard.refresh()}
        >
          <RefreshCw
            className={`size-3.5 ${dashboard.isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </PageHeader>
      <PageContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 @2xl:grid-cols-2 @4xl/page-content:grid-cols-4 @4xl/page-content:gap-6">
          {stats.map(({ title, query, status, icon: Icon, color }) => (
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
        <div className="grid grid-cols-1 gap-6 @4xl/page-content:grid-cols-3 @4xl/page-content:gap-6">
          <div className="@4xl/page-content:col-span-2 @4xl/page-content:*:h-full">
            <DashboardCard
              title="Order overview"
              description="Orders placed over the last six months · UTC"
            >
              <div className="p-4">
                <QueryBoundary
                  query={insights}
                  loading={
                    <Skeleton className="h-80 rounded-xl @4xl/page-content:col-span-2" />
                  }
                >
                  {({ data }) => <OverviewChart data={data.overview} />}
                </QueryBoundary>
              </div>
            </DashboardCard>
          </div>

          <CRMDashboardCard
            title="Orders"
            description="All-time status breakdown"
            href="/org/orders"
            segments={Object.values(STATUS).filter((status) => status.value)}
            data={ordersCount.data?.data ?? {}}
            loading={ordersCount.isPending}
            error={ordersCount.isError}
          />

          <div className="col-span-1 @4xl/page-content:col-span-2">
            <DashboardCard
              title="Recent Orders"
              description="Most recent orders placed"
            >
              <RecentOrders
                orders={orders.data?.data ?? []}
                loading={orders.isPending}
                error={orders.isError}
              />
            </DashboardCard>
          </div>
          <RankingCard
            title="Top Customers"
            description="By order value · Excludes cancelled orders"
            money={true}
            rows={insights.data?.data["topCustomers"] ?? []}
            loading={insights.isPending}
            error={insights.isError}
          />
        </div>

        <div className="grid items-start gap-4 @4xl/page-content:grid-cols-3 @4xl/page-content:gap-6">
          {rankings.map(({ key, ...props }) => (
            <RankingCard
              key={key}
              {...props}
              rows={insights.data?.data[key] ?? []}
              loading={insights.isPending}
              error={insights.isError}
            />
          ))}
        </div>
      </PageContent>
    </React.Fragment>
  )
}
