"use client"

import { ReactNode } from "react"
import { UseQueryResult } from "@tanstack/react-query"
import { EmptyState, ErrorState } from "@jp/ui/components/jp"
import { AppError } from "@jp/utils"

type QueryBoundaryProps<T> = {
  query: UseQueryResult<T>

  children: (data: T) => ReactNode

  loading: ReactNode

  isEmpty?: (data: T) => boolean
  empty?: ReactNode

  error?: (error: unknown) => ReactNode

  /**
   * Show loading on refetches (pagination, filters, etc.)
   * Defaults to false.
   */
  loadingOnFetching?: boolean
}

export function QueryBoundary<T>({
  query,
  children,
  loading,
  isEmpty,
  empty,
  error,
  loadingOnFetching = false,
}: QueryBoundaryProps<T>) {
  if (query.isPending || (loadingOnFetching && query.isFetching)) {
    return <>{loading}</>
  }

  if (query.isError) {
    return (
      error?.(query.error) ?? (
        <ErrorState
          title={query.error?.message}
          description={(query.error as AppError)?.description}
        />
      )
    )
  }

  if (!query.data) {
    return null
  }

  if (isEmpty?.(query.data)) {
    return (
      empty ?? (
        <EmptyState
          title="No data found"
          description="There is nothing to display."
        />
      )
    )
  }

  return <>{children(query.data)}</>
}
