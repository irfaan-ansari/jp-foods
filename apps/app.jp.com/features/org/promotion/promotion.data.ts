import { AppError } from "@jp/utils"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import { PaginatedResponse } from "../../shared/shared.type"
import { Promotion } from "./promotion.type"

type PromotionQuery = Record<string, string | number | undefined>

export const usePromotions = (kv?: PromotionQuery) => {
  return useQuery<PaginatedResponse<Promotion>, AppError>({
    queryKey: ["promotions", kv],
    queryFn: () => apiClient.get("/org/promotions", { params: kv }),
    staleTime: 1000 * 60 * 5,
  })
}

export const usePromotion = (id: string | number) => {
  return useQuery<{ success: boolean; data: Promotion }, AppError>({
    queryKey: ["promotions", id],
    queryFn: () => apiClient.get(`/org/promotions/${id}`),
    staleTime: 1000 * 60 * 5,
  })
}

export const useInfinitePromotions = (kv?: PromotionQuery) => {
  return useInfiniteQuery({
    queryKey: ["promotions", kv],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      return apiClient.get<PaginatedResponse<Promotion>>("/org/promotions", {
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
