"use client"

import { RefreshCw } from "lucide-react"
import { ClockCircle } from "@solar-icons/react"
import { Button } from "@jp/ui/components/button"
import { IconTile } from "@jp/ui/components/icon-tile"
import { PageContent, PageHeader } from "@/components/page-content"
import { StatCard } from "@/features/org/dashboard/components/stat-card"
import { useDashboard } from "../dashboard.data"
import { getDashboardCount } from "../dashboard.utils"
import DashboardCard from "./dashboard-card"
import { RecentSubmissions } from "./recent-submissions"

export function DashboardClient() {
  const dashboard = useDashboard()
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
          />
          Refresh
        </Button>
      </PageHeader>
      <PageContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 @2xl/page-content:grid-cols-2 @4xl/page-content:grid-cols-4 @4xl/page-content:gap-6">
          <StatCard
            title="Awaiting action"
            loading={dashboard.countsPending}
            className="bg-amber-50 ring-2 ring-amber-100"
            value={
              dashboard.countsError ? "—" : dashboard.pending.toLocaleString()
            }
            icon={
              <IconTile variant="elevated">
                <ClockCircle className="size-5 text-amber-400" />
              </IconTile>
            }
            description={
              dashboard.countsError
                ? "Unable to load · Refresh to retry"
                : "New applications awaiting action"
            }
          />
          {dashboard.sections.map(({ key, config, counts }) => (
            <StatCard
              key={key}
              title={config.title}
              loading={counts.isPending}
              value={
                counts.isError
                  ? "—"
                  : getDashboardCount(counts.data?.data.all).toLocaleString()
              }
              icon={
                <IconTile variant="elevated">
                  <config.icon className={`size-5 ${config.iconClassName}`} />
                </IconTile>
              }
              description={
                counts.isError
                  ? "Unable to load · Refresh to retry"
                  : "All-time"
              }
            />
          ))}
        </div>

        <div className="grid items-start gap-4 @4xl/page-content:grid-cols-3 @4xl/page-content:gap-6">
          {dashboard.sections.map(({ key, config, counts, query, items }) => (
            <DashboardCard
              key={key}
              title={config.title}
              description="All-time status breakdown"
              href={config.href}
              data={counts.data?.data ?? {}}
              segments={config.segments}
              loading={counts.isPending}
              error={counts.isError}
            >
              <RecentSubmissions
                items={items}
                loading={query.isPending}
                error={query.isError}
                badge={config.badge}
              />
            </DashboardCard>
          ))}
        </div>
      </PageContent>
    </>
  )
}
