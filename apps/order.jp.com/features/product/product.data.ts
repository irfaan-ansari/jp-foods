import { AppError, fetcher } from "@jp/utils"
import { Category, Product } from "./product.type"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { ApiResponse, PaginatedResponse } from "../shared/shared.type"

export const useInfiniteProducts = (kv?: Record<string, any>) => {
  const { getQueryString } = useRouterStuff()

  return useInfiniteQuery({
    queryKey: ["products", kv],
    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      const queryString = getQueryString({
        ...kv,
        page: pageParam,
      })

      return fetcher<PaginatedResponse<Product>>(
        `/api/v1/team/products${queryString}`
      )
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
  const { getQueryString } = useRouterStuff()
  const queryString = getQueryString(kv)

  return useQuery<ApiResponse<Category[]>, AppError>({
    queryKey: ["categories"],
    queryFn: async () =>
      await fetcher(`/api/v1/team/products/categories${queryString}`),
    staleTime: 50 * 60,
  })
}
