import React from "react"
import { Bell, Calendar } from "@solar-icons/react"
import { Button } from "@jp/ui/components/button"
import { ArrowRight, ChevronDown, Inbox } from "lucide-react"
import { IconTile } from "@jp/ui/components/icon-tile"
import { PageContent, PageHeader } from "@/components/page-content"
import { StatCard } from "@/features/org/dashboard/components/stat-card"

import { DashboardCard } from "@/features/org/dashboard/components/dashboard-card"

import { OverviewChart } from "@/features/org/dashboard/components/overview"

const HomePage = async () => {
  await new Promise((res) => setTimeout(res, 3000))
  return (
    <React.Fragment>
      <PageHeader title="Dashboard">
        <Button variant="ghost" size="icon">
          <Bell className="size-5" />
        </Button>
        <Button variant="outline" className="w-40 justify-start">
          <Calendar /> Today
          <ChevronDown className="ml-auto" />
        </Button>
      </PageHeader>

      <PageContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 @5xl/page-content:grid-cols-3 @5xl/page-content:gap-6">
          <div className="grid gap-4 @5xl/page-content:col-span-2 @5xl/page-content:grid-cols-2">
            <StatCard
              title="Open Orders"
              value="50"
              icon={
                <IconTile variant="elevated">
                  <Inbox />
                </IconTile>
              }
            />
            <StatCard
              title="Orders Placed"
              value="50"

              icon={
                <IconTile variant="elevated">
                  <Inbox />
                </IconTile>
              }
            />
            <StatCard
              title="Total Products"
              value="50"

              icon={
                <IconTile variant="elevated">
                  <Inbox />
                </IconTile>
              }
            />
            <StatCard
              title="Total Customers"
              value="50"

              icon={
                <IconTile variant="elevated">
                  <Inbox />
                </IconTile>
              }
            />
          </div>
          <DashboardCard title="Recent Orders">
            {["Chicken Breast", "Ground Beef", "Milk", "Eggs"].map((item) => (
              <div key={item} className="flex items-center justify-between">
                <span>{item}</span>

                <Button size="sm" variant="secondary">
                  Add
                </Button>
              </div>
            ))}
          </DashboardCard>

          <div className="@5xl/page-content:col-span-2">
            <OverviewChart />
          </div>
          <DashboardCard title="Top Customers">
            {["Chicken Breast", "Ground Beef", "Milk", "Eggs"].map((item) => (
              <div key={item} className="flex items-center justify-between">
                <span>{item}</span>

                <Button size="sm" variant="secondary">
                  Add
                </Button>
              </div>
            ))}
          </DashboardCard>
        </div>

        <div className="grid gap-4 @5xl/page-content:grid-cols-2 @5xl/page-content:gap-6">
          <DashboardCard title="Frequently Ordered">
            {["Chicken Breast", "Ground Beef", "Milk", "Eggs"].map((item) => (
              <div key={item} className="flex items-center justify-between">
                <span>{item}</span>

                <Button size="sm" variant="secondary">
                  Add
                </Button>
              </div>
            ))}
          </DashboardCard>
          <DashboardCard title="Top Categories">
            {["Chicken Breast", "Ground Beef", "Milk", "Eggs"].map((item) => (
              <div key={item} className="flex items-center justify-between">
                <span>{item}</span>

                <Button size="sm" variant="secondary">
                  Add
                </Button>
              </div>
            ))}
          </DashboardCard>
        </div>
      </PageContent>
    </React.Fragment>
  )
}

export default HomePage
