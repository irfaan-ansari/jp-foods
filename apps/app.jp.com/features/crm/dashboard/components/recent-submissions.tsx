import type { ComponentType } from "react"
import Link from "next/link"
import { formatDate } from "@jp/utils"
import { Skeleton } from "@jp/ui/components/skeleton"
import type { RecentSubmission } from "../dashboard.type"

export function RecentSubmissions({
  items,
  loading,
  error,
  badge: Badge,
}: {
  items: RecentSubmission[]
  loading: boolean
  error: boolean
  badge: ComponentType<{ status: string }>
}) {
  if (loading)
    return (
      <div
        role="status"
        aria-label="Loading recent submissions"
        className="space-y-3 p-4"
      >
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    )
  if (error)
    return (
      <p role="alert" className="p-4 text-sm text-destructive">
        Unable to load submissions. Use Refresh to retry.
      </p>
    )
  if (!items.length)
    return (
      <p className="p-4 text-sm text-muted-foreground">
        No recent submissions.
      </p>
    )

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id} className="not-last:border-b">
          <Link
            href={item.href}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="grid min-w-0 flex-1 gap-1">
              <span className="truncate">{item.name}</span>
              <span className="text-xs text-muted-foreground">
                {item.createdAt
                  ? formatDate(item.createdAt)
                  : "Date unavailable"}
              </span>
            </div>
            <Badge status={item.status} />
          </Link>
        </li>
      ))}
    </ul>
  )
}
