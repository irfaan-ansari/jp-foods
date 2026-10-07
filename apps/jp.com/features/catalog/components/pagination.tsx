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
  const currentPage = Math.max(
    1,
    Math.min(Number(page), Math.max(1, totalPages))
  )
  const start = total === 0 ? 0 : (currentPage - 1) * limit + 1
  const end = Math.min(currentPage * limit, total)
  const visiblePages = [
    ...new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages]),
  ]
    .filter((number) => number >= 1 && number <= totalPages)
    .sort((a, b) => a - b)
  const goTo = (number: number) =>
    queryParams({ set: { page: String(number) }, scroll: false })
  return (
    <div className="flex flex-col items-center justify-between gap-5 pt-6 sm:flex-row">
      <p className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground">
          {start}-{end}
        </span>{" "}
        of{" "}
        <span className="font-medium text-foreground">
          {total.toLocaleString()}
        </span>{" "}
        products
      </p>
      <nav
        aria-label="Catalog pagination"
        className="flex items-center gap-1.5"
      >
        <Button
          variant="outline"
          size="icon"
          className="rounded-lg"
          aria-label="Previous page"
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <span className="px-3 text-sm sm:hidden">
          Page {currentPage} of {Math.max(1, totalPages)}
        </span>
        <div className="hidden items-center gap-1.5 sm:flex">
          {visiblePages.map((number, index) => (
            <span key={number} className="flex items-center gap-1.5">
              {index > 0 && number - visiblePages[index - 1]! > 1 && (
                <span className="px-2 text-muted-foreground" aria-hidden="true">
                  ...
                </span>
              )}
              <Button
                variant={number === currentPage ? "default" : "ghost"}
                size="icon"
                className="rounded-lg"
                aria-label={`Page ${number}`}
                aria-current={number === currentPage ? "page" : undefined}
                onClick={() => goTo(number)}
              >
                {number}
              </Button>
            </span>
          ))}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="rounded-lg"
          aria-label="Next page"
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <ArrowRight className="size-4" />
        </Button>
      </nav>
    </div>
  )
}
