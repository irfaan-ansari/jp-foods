import { cn } from "@jp/ui/lib/utils"
import { Skeleton } from "../skeleton"

type QueryStateProps = {
  isPending: boolean
  isError: boolean
  error?: Error | null
  isEmpty?: boolean
  children: React.ReactNode
  className?: string
}

export function QueryState({
  isPending,
  isError,
  isEmpty,
  error,
  className,
  children,
}: QueryStateProps) {
  if (isPending) {
    return (
      <div className={cn("space-y-1", className)}>
        <Skeleton className="h-10 rounded-xl" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="py-4 text-center text-muted-foreground">
        Failed to load.
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="py-4 text-center text-muted-foreground">
        No result found.
      </div>
    )
  }

  return children
}
