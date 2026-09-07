import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@jp/ui/components/empty"
import { cn } from "@jp/ui/lib/utils"

import { Loader2 } from "lucide-react"
import { Skeleton } from "@jp/ui/components/skeleton"

function StackedCardsIllustration() {
  return (
    <div className="relative h-24 w-52" aria-hidden="true">
      {/* Back card */}
      <div className="absolute inset-x-6 top-0 h-6 rounded-t-lg border border-border/50 bg-muted/60 dark:bg-muted/30" />
      {/* Middle card */}
      <div className="absolute inset-x-3 top-3 h-6 rounded-t-lg border border-border/60 bg-muted/80 dark:bg-muted/50" />
      {/* Front card */}
      <div className="absolute inset-x-0 top-6 flex h-16 items-center gap-3 rounded-lg border border-border bg-background px-4 shadow-sm">
        <div className="inline-flex size-8 shrink-0 items-center justify-center rounded bg-muted text-xs text-muted-foreground">
          <svg className="size-4" fill="none" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.5 2.75C6.66751 2.75 2.75 6.66751 2.75 11.5C2.75 16.3325 6.66751 20.25 11.5 20.25C16.3325 20.25 20.25 16.3325 20.25 11.5C20.25 6.66751 16.3325 2.75 11.5 2.75ZM1.25 11.5C1.25 5.83908 5.83908 1.25 11.5 1.25C17.1609 1.25 21.75 5.83908 21.75 11.5C21.75 17.1609 17.1609 21.75 11.5 21.75C5.83908 21.75 1.25 17.1609 1.25 11.5ZM19.4697 19.4697C19.7626 19.1768 20.2374 19.1768 20.5303 19.4697L22.5303 21.4697C22.8232 21.7626 22.8232 22.2374 22.5303 22.5303C22.2374 22.8232 21.7626 22.8232 21.4697 22.5303L19.4697 20.5303C19.1768 20.2374 19.1768 19.7626 19.4697 19.4697Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="h-2.5 w-3/4 rounded bg-muted" />
          <div className="h-2 w-1/2 rounded bg-muted/60" />
        </div>
      </div>
      {/* Fade overlay */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-linear-to-b from-background/0 via-background/60 to-background" />
    </div>
  )
}

function BoardIllustration() {
  return (
    <svg
      className="size-28"
      width="180"
      height="160"
      viewBox="0 0 180 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Shadow */}
      <ellipse
        cx="90"
        cy="148"
        rx="60"
        ry="8"
        className="fill-muted-foreground/8 dark:fill-muted-foreground/5"
      />
      {/* Isometric board - back face */}
      <path
        d="M30 40 L90 10 L160 45 L100 75 Z"
        className="fill-muted/80 stroke-border dark:fill-muted/40"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Board - front face */}
      <path
        d="M30 40 L100 75 L100 110 L30 75 Z"
        className="fill-muted stroke-border dark:fill-muted/60"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Board - right face */}
      <path
        d="M100 75 L160 45 L160 80 L100 110 Z"
        className="fill-background stroke-border"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Content lines on the board surface - isometric */}
      {/* Row 1 */}
      <circle cx="62" cy="35" r="4" className="fill-primary/20" />
      <line
        x1="72"
        y1="33"
        x2="105"
        y2="17"
        className="stroke-muted-foreground/20"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="110"
        y1="15"
        x2="130"
        y2="5"
        className="stroke-muted-foreground/15"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Row 2 */}
      <circle cx="55" cy="50" r="4" className="fill-primary/30" />
      <line
        x1="65"
        y1="48"
        x2="100"
        y2="31"
        className="stroke-muted-foreground/20"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="105"
        y1="29"
        x2="135"
        y2="14"
        className="stroke-muted-foreground/12"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Row 3 */}
      <circle cx="48" cy="65" r="4" className="fill-destructive/25" />
      <line
        x1="58"
        y1="63"
        x2="88"
        y2="48"
        className="stroke-muted-foreground/18"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  )
}

interface EmptyProps {
  title: string
  description?: string
}
export function EmptyState({ title, description }: EmptyProps) {
  return (
    <Empty className="py-12">
      <EmptyHeader>
        <EmptyMedia>
          <StackedCardsIllustration />
        </EmptyMedia>
        <EmptyTitle className="font-sans text-base font-semibold">
          {title}
        </EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
    </Empty>
  )
}

export function ErrorState({ title, description }: EmptyProps) {
  return (
    <Empty className="py-12">
      <EmptyHeader>
        <EmptyMedia>
          <BoardIllustration />
        </EmptyMedia>
        <EmptyTitle className="font-sans text-base font-semibold">
          {title}
        </EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
    </Empty>
  )
}

export const Spinner = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex h-full items-center justify-center", className)}>
      <Loader2 className="animate-spin" />
    </div>
  )
}

export const HeaderSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn("shrink-0", className)}>
      <header className="border-b px-3 lg:px-6">
        <div className="flex min-h-16 items-center justify-between gap-4 py-3">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="ml-auto h-8 w-24" />
          <Skeleton className="size-9" />
        </div>
      </header>
    </div>
  )
}

export const PageContentSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn("mx-auto mt-10 w-full max-w-2xl space-y-6", className)}>
      <div className="space-y-2">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-12 w-full" />
      </div>
      <Skeleton className="h-20 w-full" />
    </div>
  )
}
