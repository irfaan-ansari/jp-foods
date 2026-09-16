"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@jp/ui/components/chart"
import type { DashboardData } from "../dashboard.type"
import { DashboardCard } from "./dashboard-card"

export function OverviewChart({ data }: { data: DashboardData["overview"] }) {
  return (
    <DashboardCard
      title="Order overview"
      description="Orders placed over the last six months · UTC"
    >
      {data.every((month) => month.orders === 0) ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          No orders placed in the last six months.
        </p>
      ) : (
        <ChartContainer
          config={{ orders: { label: "Orders", color: "var(--chart-1)" } }}
          className="h-64 w-full"
        >
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              width={36}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="orders"
              fill="var(--color-orders)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      )}
    </DashboardCard>
  )
}
