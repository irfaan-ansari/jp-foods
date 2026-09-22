"use client"
import Link from "next/link"
import { useCount } from "@/features/shared/shared.data"

import { Badge } from "@jp/ui/components/badge"
import { Skeleton } from "@jp/ui/components/skeleton"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"

interface FilterTabProps {
  tabs: { label: string; value: string; color: string }[]
  path: string
  queryKey?: string
  preserveQuery?: boolean
}

export const FilterTab = ({
  tabs,
  path,
  queryKey = "status",
  preserveQuery = false,
}: FilterTabProps) => {
  const { searchParamsObj, searchParams } = useRouterStuff()

  const { data, isPending } = useCount(path)

  const activeStatus =
    typeof searchParamsObj[queryKey] === "string"
      ? searchParamsObj[queryKey]
      : undefined

  return (
    <div className="relative no-scrollbar flex shrink-0 items-start gap-1 overflow-x-auto">
      {tabs.map(({ label, value, color }, i) => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete(queryKey)
        params.delete("page")
        if (value) params.set(queryKey, value)

        return (
          <Link
            key={value + i}
            href={
              preserveQuery
                ? `?${params.toString()}`
                : `?${value ? `${queryKey}=${value}` : ""}`
            }
            data-active={activeStatus === value || (!value && !activeStatus)}
            className="relative z-1 inline-flex h-9 items-center gap-2 rounded-xl border bg-background px-3 pr-2 text-sm leading-tight font-medium whitespace-nowrap transition hover:bg-foreground hover:text-muted data-active:border-foreground data-active:bg-foreground data-active:text-muted"
            style={{ "--color": color } as React.CSSProperties}
          >
            {label}
            {isPending ? (
              <Skeleton className="size-6 rounded-full" />
            ) : (
              <Badge
                variant="outline"
                className="h-6 min-w-6 rounded-full border-(--color)/10 bg-(--color)/10 px-1 text-xs text-(--color)"
              >
                {data?.data?.[value || "all"] ?? 0}
              </Badge>
            )}
          </Link>
        )
      })}
    </div>
  )
}
