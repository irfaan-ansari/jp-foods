import type { ReactNode } from "react"
import Link from "next/link"
import { Button } from "@jp/ui/components/button"
import { Skeleton } from "@jp/ui/components/skeleton"
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"
import type { BadgeStatus } from "@/features/shared/shared.type"
import type { Status } from "@/features/shared/shared.data"
import { getDashboardCount } from "../dashboard.utils"

interface DashboardCardProps {
  title: string
  description: string
  segments: readonly BadgeStatus[]
  href: string
  data: Status
  loading?: boolean
  error?: boolean
  children?: ReactNode
}

export default function DashboardCard({
  title,
  description,
  segments,
  data,
  href,
  loading,
  error,
  children,
}: DashboardCardProps) {
  const total = getDashboardCount(data.all)
  return (
    <Card size="sm" className="h-full overflow-hidden pb-0">
      <CardHeader className="gap-1 border-b">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <Button size="xs" asChild>
            <Link href={href}>View all</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <div>
        <div className="space-y-4 border-b px-4 pb-4">
          {loading ? (
            <div
              role="status"
              aria-label="Loading status breakdown"
              className="space-y-4"
            >
              {segments.map((segment) => (
                <Skeleton key={segment.value} className="h-10 w-full" />
              ))}
            </div>
          ) : error ? (
            <p role="alert" className="text-sm text-destructive">
              Unable to load counts. Use Refresh to retry.
            </p>
          ) : (
            segments.map((segment) => {
              const count = getDashboardCount(data[segment.value])
              const percentage =
                total > 0 ? Math.min(100, (count / total) * 100) : 0
              return (
                <Link
                  key={segment.value}
                  href={`${href}?status=${encodeURIComponent(segment.value)}`}
                  className="block space-y-1.5 rounded-md focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="flex justify-between gap-2 text-sm">
                    <span>{segment.label}</span>
                    <span className="text-base font-semibold tabular-nums">
                      {count.toLocaleString()}
                    </span>
                  </div>
                  <div
                    className="h-1.5 overflow-hidden rounded-full bg-muted"
                    aria-hidden="true"
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: segment.color,
                      }}
                    />
                  </div>
                </Link>
              )
            })
          )}
        </div>
        {children}
      </div>
    </Card>
  )
}
