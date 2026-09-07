import React from "react"
import Link from "next/link"
import { Bell, User } from "@solar-icons/react"
import { Button } from "@jp/ui/components/button"
import { ArrowRight, Inbox, Plus } from "lucide-react"
import { IconTile } from "@jp/ui/components/icon-tile"
import { PageContent, PageHeader } from "@/components/page-content"
import { StatCard } from "@/features/dashboard/components/stat-card"
import { Promotion } from "@/features/promotion/components/promotion"
import { DashboardCard } from "@/features/dashboard/components/dashboard-card"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@jp/ui/components/card"
import { RecentOrders } from "@/features/dashboard/components/recent-orders"
import { OrderGuides } from "@/features/dashboard/components/order-guides"
import { OverviewChart } from "@/features/dashboard/components/overview"

const HomePage = async () => {
  await new Promise((res) => setTimeout(res, 3000))
  return (
    <React.Fragment>
      <PageHeader title="Dashboard">
        <Button variant="ghost" size="icon">
          <Bell className="size-5" />
        </Button>
        <Button size="lg" asChild>
          <Link href="/create/all">
            <Plus /> New Order
          </Link>
        </Button>
      </PageHeader>

      <PageContent className="space-y-6">
        <Promotion placement="banner" />
        <div className="flex items-start justify-center gap-4">
          <div className="grid flex-1">
            <h2 className="font-semibold">Welcome back</h2>
            <p className="text-sm text-muted-foreground">
              You have 2 active orders and 1 invoice due today.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card
              size="sm"
              className="bg-secondary/50 py-3 shadow-xs transition hover:-translate-y-0.5"
            >
              <CardContent className="flex flex-row gap-3 px-3">
                <IconTile size="sm">
                  <User />
                </IconTile>
                <div className="grid">
                  <CardTitle>New order</CardTitle>
                  <CardDescription>Lorem ipsum dolor.</CardDescription>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Open Orders"
            value="50"
            description="Awaiting dispatch"
            icon={
              <IconTile variant="elevated">
                <Inbox />
              </IconTile>
            }
          />
          <StatCard
            title="Orders Placed"
            value="50"
            description="This month"
            icon={
              <IconTile variant="elevated">
                <Inbox />
              </IconTile>
            }
          />
          <StatCard
            title="Outstanding"
            value="50"
            description="2 unpaid invoices"
            icon={
              <IconTile variant="elevated">
                <Inbox />
              </IconTile>
            }
          />
          <StatCard
            title="Available limit"
            value="50"
            description="2 unpaid invoices"
            icon={
              <IconTile variant="elevated">
                <Inbox />
              </IconTile>
            }
          />
        </div>
        <div className="grid">
          <DashboardCard
            title="Recommeded For You"
            action={
              <Button variant="link" size="sm">
                View All <ArrowRight />
              </Button>
            }
          >
            Product card
          </DashboardCard>
        </div>
        <div className="grid grid-cols-6 gap-6">
          <div className="col-span-4">
            <OverviewChart />
          </div>
          <div className="col-span-2 space-y-2">
            <OrderGuides />
          </div>
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <RecentOrders />
          <DashboardCard title="Due Invoices">
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
        <div className="grid gap-6 lg:grid-cols-2">
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
