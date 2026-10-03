"use client"
import Link from "next/link"
import { useCount } from "@/features/shared/shared.data"

import { Badge } from "@jp/ui/components/badge"
import { Skeleton } from "@jp/ui/components/skeleton"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { PopDrawer } from "@jp/ui/components/jp"
import { Button } from "@jp/ui/components/button"
import React from "react"
import { cn } from "@jp/ui/lib/utils"

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
  const [open, setOpen] = React.useState(false)
  const { searchParamsObj, searchParams } = useRouterStuff()

  const { data, isPending } = useCount(path)

  const activeStatus = tabs.find(
    ({ value }) => value === (searchParamsObj[queryKey] || "")
  )

  return (
    <div className="w-full self-start @5xl/page-content:w-auto">
      {/* mobile */}
      <PopDrawer
        open={open}
        setOpen={setOpen}
        trigger={
          <Button
            size="default"
            variant="outline"
            className="w-full min-w-44 justify-start text-left @5xl/page-content:hidden"
            style={{ "--color": activeStatus?.color } as React.CSSProperties}
          >
            <BadgeDot />
            <span className="flex-1">{activeStatus?.label}</span>
            <BadgeValue
              value={
                (data?.data?.[activeStatus?.value || "all"] ?? "0") as string
              }
            />
          </Button>
        }
      >
        {tabs.map(({ label, value, color }, i) => {
          const params = new URLSearchParams(searchParams.toString())
          params.delete(queryKey)
          params.delete("page")
          if (value) params.set(queryKey, value)

          return (
            <Button
              variant="ghost"
              asChild
              className="justify-start data-active:bg-secondary"
              data-active={activeStatus?.value === value}
              key={value + i}
            >
              <Link
                key={value + i}
                href={
                  preserveQuery
                    ? `?${params.toString()}`
                    : `?${value ? `${queryKey}=${value}` : ""}`
                }

                style={{ "--color": color } as React.CSSProperties}
              >
                <BadgeDot />
                <span className="flex-1">{label}</span>
                {isPending ? (
                  <Skeleton className="size-6 rounded-full" />
                ) : (
                  <BadgeValue
                    value={(data?.data?.[value || "all"] ?? "0") as string}
                  />
                )}
              </Link>
            </Button>
          )
        })}
      </PopDrawer>
      <div className="relative no-scrollbar hidden shrink-0 items-start gap-1 overflow-x-auto @5xl/page-content:flex">
        {tabs.map(({ label, value, color }, i) => {
          const params = new URLSearchParams(searchParams.toString())
          params.delete(queryKey)
          params.delete("page")
          if (value) params.set(queryKey, value)

          return (
            <Button
              asChild
              key={value + i}
              variant="outline"
              data-active={activeStatus?.value === value}
              className="h-8 pr-1.5 hover:bg-foreground hover:text-muted data-active:border-foreground data-active:bg-foreground data-active:text-muted"
            >
              <Link
                href={
                  preserveQuery
                    ? `?${params.toString()}`
                    : `?${value ? `${queryKey}=${value}` : ""}`
                }

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
            </Button>
          )
        })}
      </div>
    </div>
  )
}

const BadgeDot = ({ className }: { className?: string }) => {
  return (
    <span
      className={cn("size-1.5 shrink-0 rounded-full bg-(--color)", className)}
    />
  )
}

const BadgeValue = ({ value }: { value: string }) => {
  return (
    <Badge
      variant="outline"
      className="h-5 min-w-5 rounded-full border-(--color)/10 bg-(--color)/10 px-1 text-xs text-(--color)"
    >
      {value}
    </Badge>
  )
}
