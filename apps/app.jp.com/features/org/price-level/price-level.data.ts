import { AppError } from "@jp/utils"
import { PriceLevel } from "./price-level.type"
import { apiClient } from "@/lib/api-client"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { PaginatedResponse } from "@/features/shared/shared.type"

export const usePriceLevels = (kv?: Record<string, any>) => {
  return useQuery<PaginatedResponse<PriceLevel>, AppError>({
    queryKey: ["price-levels", kv],
    queryFn: () =>
      apiClient.get(`/org/price-levels`, {
        params: kv,
      }),
    staleTime: 1000 * 60 * 5,
  })
}

export const useInfinitePriceLevels = (kv?: Record<string, any>) => {
  return useInfiniteQuery({
    queryKey: ["price-levels", kv],
    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      return apiClient.get<PaginatedResponse<PriceLevel>>(`/org/price-levels`, {
        params: { ...kv, page: pageParam },
      })
    },

    getNextPageParam: (lastPage) => {
      return lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined
    },

    staleTime: 1000 * 60 * 5,
  })
}
