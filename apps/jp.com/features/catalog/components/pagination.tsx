import { Button } from "@jp/ui/components/button"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"

interface PaginationProps {
  page: number
  totalPages: number
  total: number
  limit: number
  onPageChange: (page: number) => void
}

export const Pagination = ({
  page,
  totalPages,
  total,
  limit,
}: PaginationProps) => {
  const { queryParams } = useRouterStuff()
  const start = total === 0 ? 0 : (page - 1) * limit + 1
  const end = Math.min(page * limit, total)

  return (
    <div className="sticky bottom-4 z-2 mx-auto mt-auto flex w-full max-w-sm items-center justify-between rounded-2xl border-2 bg-white/90 p-4 text-sm text-muted-foreground backdrop-blur-2xl">
      <span>
        Showing {start}–{end} of {total}
      </span>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="rounded-xl"
          onClick={() => queryParams({ set: { page: (page - 1).toString() } })}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl"
          onClick={() =>
            queryParams({ set: { page: (Number(page) + 1).toString() } })
          }
          disabled={page === totalPages || totalPages === 0}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
