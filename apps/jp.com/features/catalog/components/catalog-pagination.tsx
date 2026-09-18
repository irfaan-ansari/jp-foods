"use client"
import { Pagination } from "@/features/catalog/components/pagination"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"

export const PageClient = ({
  pagination,
}: {
  pagination: { page: number; limit: number; total: number; totalPages: number }
}) => {
  const { queryParams } = useRouterStuff()
  return (
    <Pagination
      page={pagination.page}
      limit={pagination.limit}
      total={pagination.total}
      totalPages={pagination.totalPages}
      onPageChange={(page) => queryParams({ set: { page: page.toString() } })}
    />
  )
}
