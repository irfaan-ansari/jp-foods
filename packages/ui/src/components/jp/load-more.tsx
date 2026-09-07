import { Loader2 } from "lucide-react"

import { Button } from "@jp/ui/components/button"
import { useInfiniteScroll } from "@jp/ui/hooks/use-infinite-scroll"
import { cn } from "@jp/ui/lib/utils"

interface LoadMoreProps {
  hasMore?: boolean
  loading?: boolean
  onLoadMore: () => void | Promise<unknown>
  autoLoad?: boolean
  children?: React.ReactNode
  className?: string
}

export function LoadMore({
  hasMore = false,
  loading = false,
  onLoadMore,
  autoLoad = true,
  className,
  children,
}: LoadMoreProps) {
  const ref = useInfiniteScroll(() => {
    if (autoLoad && hasMore && !loading) {
      onLoadMore()
    }
  }, autoLoad)

  if (!hasMore) {
    return null
  }

  return (
    <div
      ref={ref}
      className={cn("mt-4 flex min-h-10 w-full justify-center", className)}
    >
      {children ?? (
        <Button
          size="sm"
          type="button"
          variant="secondary"
          onClick={() => onLoadMore()}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Loading...
            </>
          ) : (
            "Load more"
          )}
        </Button>
      )}
    </div>
  )
}
