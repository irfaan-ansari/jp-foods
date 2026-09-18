"use client"
import { Button } from "@jp/ui/components/button"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface PaginationProps {
  page: number
  totalPages: number
  total: number
  limit: number
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
    <div className="flex w-full items-center justify-center rounded-2xl py-4">
      <Button
        className="min-w-30 justify-between bg-invert hover:bg-invert"
        onClick={() => queryParams({ set: { page: (page - 1).toString() } })}
        disabled={page === 1}
      >
        <ArrowLeft />
        Previous
      </Button>
      <span className="self-center px-10">
        {start}–{end} of {total}
      </span>
      <Button
        className="min-w-30 justify-between bg-invert hover:bg-invert"
        onClick={() =>
          queryParams({ set: { page: (Number(page) + 1).toString() } })
        }
        disabled={page === totalPages || totalPages === 0}
      >
        Next <ArrowRight />
      </Button>
    </div>
  )
}
