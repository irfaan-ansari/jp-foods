"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@jp/ui/components/chart"
import type { DashboardData } from "../dashboard.type"

export function OverviewChart({ data }: { data: DashboardData["overview"] }) {
  if (data.every((month) => month.orders === 0))
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        No orders placed in the last six months.
      </p>
    )
  return (
    <ChartContainer
      config={{
        orders: { label: "Orders" },
        total: { label: "Total" },
      }}
      className="h-64 w-full"
    >
      <AreaChart data={data.map((d) => ({ ...d, total: 50 }))}>
        <defs>
          <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-3)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
        />

        <ChartTooltip content={<ChartTooltipContent />} />

        <Area
          dataKey="orders"
          type="natural"
          fill="url(#fillCount)"
          stroke="var(--chart-1)"
          stackId="a"
        />
        <Area
          dataKey="total"
          type="natural"
          fill="url(#fillTotal)"
          stroke="var(--chart-2)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  )
}
