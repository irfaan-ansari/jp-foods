"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@jp/ui/components/chart"
import type { DashboardData } from "../dashboard.type"
import { formatUSD } from "@jp/utils"

export function OverviewChart({ data }: { data: DashboardData["overview"] }) {
  if (data.every((month) => month.total === 0))
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        No orders placed in the last six months.
      </p>
    )
  return (
    <ChartContainer
      config={{
        total: { label: "Total", color: "var(--primary)" },
      }}
      className="h-64 w-full"
    >
      <AreaChart data={data} margin={{ left: 8, right: 8, top: 12 }}>
        <defs>
          <linearGradient id="orderSpend" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        {/* <YAxis
          width={64}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => formatUSD(value)}
        /> */}
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
          stroke="var(--primary)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  )
}
