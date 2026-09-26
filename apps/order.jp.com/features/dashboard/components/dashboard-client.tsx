"use client"

import Link from "next/link"
import {
  ArrowRight,
  Clock3,
  PackageCheck,
  ReceiptText,
  Wallet,
} from "lucide-react"

import { Button } from "@jp/ui/components/button"
import { CardDescription, CardTitle } from "@jp/ui/components/card"
import { IconTile } from "@jp/ui/components/icon-tile"

import { formatDate, formatUSD } from "@jp/utils"

import { StatusBadge } from "@/components/status-badge"
import { useOrderDashboard } from "@/features/order/order.data"

import { DashboardCard } from "./dashboard-card"
import { OrderGuides } from "./order-guides"
import { OverviewChart } from "./overview"
import { StatCard } from "./stat-card"
import { Promotion } from "@/features/promotion/components/promotion"

export function DashboardClient() {
  const { data: dashboard, isPending, isError } = useOrderDashboard()
  const data = dashboard?.data

  return (
    <div className="space-y-6">
      <Promotion placement="banner" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Open orders"
          value={String(data?.stats?.openOrderCount)}
          loading={isPending}
          icon={
            <IconTile variant="elevated">
              <Clock3 className="text-amber-500" />
            </IconTile>
          }
        />
        <StatCard
          title="Orders this month"
          value={String(data?.stats?.monthOrderCount)}
          loading={isPending}
          description={`${data?.stats?.totalOrderCount} orders in total`}
          icon={
            <IconTile variant="elevated">
              <PackageCheck className="text-lime-500" />
            </IconTile>
          }
        />
        <StatCard
          title="Spend this month"
          value={formatUSD(data?.stats?.monthSpend!)}
          loading={isPending}
          description="Including tax and order charges"
          icon={
            <IconTile variant="elevated">
              <Wallet className="text-purple-500" />
            </IconTile>
          }
        />
        <StatCard
          title="Average order"
          loading={isPending}
          value={formatUSD(
            data?.stats?.monthOrderCount
              ? data?.stats?.monthSpend / data?.stats?.monthOrderCount
              : 0
          )}
          description="For orders placed this month"
          icon={
            <IconTile variant="elevated">
              <ReceiptText className="text-sky-500" />
            </IconTile>
          }
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
        <OverviewChart data={data?.spend!} loading={isPending} />
        <OrderGuides />
      </div>

      <DashboardCard
        title="Recent orders"
        description="Track your latest orders and delivery dates"
        action={
          <Button asChild size="sm" variant="ghost">
            <Link href="/orders">
              View all <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        }
      >
        {data?.recentOrders?.length ? (
          <div className="divide-y divide-dashed">
            {data.recentOrders.map((order) => (
              <Link
                href={`/orders/${order.id}`}
                key={order.id}
                className="flex items-center gap-4 px-4 py-3 hover:bg-secondary/50"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle>Order #{order.id}</CardTitle>
                    <StatusBadge status={order.status} />
                  </div>
                  <CardDescription className="text-xs">
                    Placed {formatDate(order.createdAt)} ·{" "}
                    {order.lineItemCount ?? 0} items
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatUSD(order.total)}</p>
                  <p className="text-xs text-muted-foreground">
                    Delivery {formatDate(order.deliveryDate)}
                  </p>
                </div>
                <ArrowRight className="size-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Your recent orders will appear here.
          </div>
        )}
      </DashboardCard>
    </div>
  )
}
