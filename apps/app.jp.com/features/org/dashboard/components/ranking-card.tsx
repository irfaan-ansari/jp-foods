import Link from "next/link"
import { formatUSD } from "@jp/utils"
import { Skeleton } from "@jp/ui/components/skeleton"
import type { DashboardRanking } from "../dashboard.type"
import { DashboardCard } from "./dashboard-card"

export function RankingCard({
  title,
  description,
  rows,
  money = false,
  loading = false,
  error = false,
}: {
  title: string
  description: string
  rows: DashboardRanking[]
  money?: boolean
  loading?: boolean
  error?: boolean
}) {
  return (
    <DashboardCard title={title} description={description}>
      {loading ? (
        <div
          role="status"
          aria-label={`Loading ${title}`}
          className="space-y-3 p-4"
        >
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      ) : error ? (
        <p role="alert" className="text-sm text-destructive">
          Unable to load rankings. Use Refresh to retry.
        </p>
      ) : rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No order activity yet.
        </p>
      ) : (
        <ol className="divide-y divide-dashed">
          {rows?.map((row, index) => {
            const content = (
              <>
                <span className="w-5 shrink-0 text-xs text-muted-foreground">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                  {row.name}
                </span>
                <span className="shrink-0 text-sm tabular-nums">
                  {money
                    ? formatUSD(row.value)
                    : `${row.value.toLocaleString()} ${row.value === 1 ? "order" : "orders"}`}
                </span>
              </>
            )
            return (
              <li key={row.id}>
                {row.href ? (
                  <Link
                    href={row.href}
                    className="flex items-center gap-3 rounded-md px-4 py-3 hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {content}
                  </Link>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3">
                    {content}
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      )}
    </DashboardCard>
  )
}
