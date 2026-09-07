import React from "react"
import Link from "next/link"
import type { ReactNode } from "react"
import { cn } from "@jp/ui/lib/utils"
import { ChevronLeftIcon } from "lucide-react"
import { SidebarTrigger } from "@jp/ui/components/sidebar"
import { HeaderSkeleton, PageContentSkeleton } from "@jp/ui/components/jp"

interface PageHeaderProps {
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  backUrl?: string
  backLabel?: string
  className?: string
  loading?: boolean
  children?: ReactNode
}

export function PageHeader({
  title,
  description,
  backUrl,
  backLabel,
  className,
  loading = false,
  children,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-2 border-b px-3 backdrop-blur-xl lg:px-6",
        className
      )}
    >
      {loading ? (
        <HeaderSkeleton />
      ) : (
        <div className="flex min-h-16 items-center justify-between gap-4 py-3">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {backUrl ? (
              <Link
                href={backUrl}
                className="group/link inline-flex items-center gap-2.5 text-sm font-semibold"
              >
                <span className="inline-flex size-6 items-center justify-center rounded-lg bg-neutral-200/60 text-muted-foreground transition group-hover/link:-translate-x-0.5 group-hover/link:text-foreground">
                  <ChevronLeftIcon className="size-4" />
                </span>
                {backLabel}
              </Link>
            ) : (
              <SidebarTrigger />
            )}

            <div className="truncate">
              <h1 className="truncate text-lg font-bold">{title}</h1>
              {description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
          </div>

          {children && (
            <div className="flex shrink-0 items-center gap-2">{children}</div>
          )}
        </div>
      )}
    </header>
  )
}

export const PageContent = ({
  className,
  children,
  loading = false,
}: {
  className?: string
  children?: React.ReactNode
  loading?: boolean
}) => {
  return (
    <div className={cn("w-full flex-1 space-y-6 px-3 py-6 lg:px-6", className)}>
      {loading ? <PageContentSkeleton /> : children}
    </div>
  )
}

export const GridWrapper = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "grid h-full grid-cols-1 place-content-start gap-4 @2xl/page-content:grid-cols-2 @5xl/page-content:grid-cols-3 @7xl/page-content:grid-cols-4",
        className
      )}
      {...props}
    />
  )
}
