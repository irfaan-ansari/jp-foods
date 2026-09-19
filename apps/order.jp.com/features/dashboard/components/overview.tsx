"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@jp/ui/components/chart"
import { formatUSD } from "@jp/utils"

import { DashboardCard } from "./dashboard-card"
import { Skeleton } from "@jp/ui/components/skeleton"

const chartConfig = {
  total: { label: "Order total", color: "var(--primary)" },
} satisfies ChartConfig

export function OverviewChart({
  data,
  loading,
}: {
  data: { month: string; total: number }[]
  loading: boolean
}) {
  return (
    <DashboardCard
      title="Order spend"
      description="Your order totals over the last six months"
    >
      {loading ? (
        <Skeleton className="w-full h-72" />
      ) : (
        <div className="px-4 pt-4">
          <ChartContainer config={chartConfig} className="w-full h-72">
            <AreaChart data={data} margin={{ left: 8, right: 8, top: 12 }}>
              <defs>
                <linearGradient id="orderSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-total)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-total)"
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis
                width={64}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatUSD(value)}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value) => formatUSD(value as number)}
                  />
                }
              />
              <Area
                dataKey="total"
                type="monotone"
                fill="url(#orderSpend)"
                stroke="var(--color-total)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      )}
    </DashboardCard>
  )
}
