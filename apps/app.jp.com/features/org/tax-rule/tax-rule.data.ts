import { AppError } from "@jp/utils"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { PaginatedResponse } from "../../shared/shared.type"
import { TaxRule } from "./tax-rule.type"
import { apiClient } from "@/lib/api-client"

export const useTaxRules = (kv?: Record<string, any>) => {
  return useQuery<PaginatedResponse<TaxRule>, AppError>({
    queryKey: ["tax-rules", kv],
    queryFn: () => apiClient.get(`/org/tax-rules`, { params: kv }),
    staleTime: 1000 * 60 * 5,
  })
}

export const useInfiniteTaxRules = (kv?: Record<string, any>) => {
  return useInfiniteQuery({
    queryKey: ["tax-rules", kv],
    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      return apiClient.get<PaginatedResponse<TaxRule>>(`/org/tax-rules`, {
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
