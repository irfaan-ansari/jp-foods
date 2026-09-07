import { AppError } from "@jp/utils"
import { Category, Product } from "./product.type"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { ApiResponse, PaginatedResponse } from "../shared/shared.type"
import { apiClient } from "@/lib/api-client"

export const useInfiniteProducts = (kv?: Record<string, any>) => {
  return useInfiniteQuery({
    queryKey: ["products", kv],
    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      return apiClient.get<PaginatedResponse<Product>>(`/products`, {
        params: {
          ...kv,
          page: pageParam,
        },
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

export const useCategories = (kv?: Record<string, any> | undefined) => {
  return useQuery<ApiResponse<Category[]>, AppError>({
    queryKey: ["categories"],
    queryFn: async () =>
      await apiClient.get(`/products/categories`, {
        params: kv,
      }),
    staleTime: 50 * 60,
  })
}
