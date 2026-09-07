"use client"

import { AppError, fetcher } from "@jp/utils"

import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import type {
  PaginatedResponse,
  ApiResponse,
} from "@/features/shared/shared.type"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import type { Category, Product } from "@/features/org/product/product.type"

export const useProducts = (kv?: Record<string, any>) => {
  const { getQueryString } = useRouterStuff()
  const queryString = getQueryString(kv)

  return useQuery<PaginatedResponse<Product>, AppError>({
    queryKey: ["products", queryString],
    queryFn: () => fetcher(`/api/v1/org/products${queryString}`),
    staleTime: 1000 * 60 * 5,
  })
}

export const useProduct = (id: number | string) => {
  return useQuery<ApiResponse<Product>, AppError>({
    queryKey: ["product", id],
    queryFn: () => fetcher(`/api/v1/org/products/${id}`),
    staleTime: 50 * 60,
  })
}

export const useCategories = (kv?: Record<string, any> | undefined) => {
  const { getQueryString } = useRouterStuff()
  const queryString = getQueryString(kv)

  return useQuery<PaginatedResponse<Category>, AppError>({
    queryKey: ["categories"],
    queryFn: async () =>
      await fetcher(`/api/v1/org/products/categories${queryString}`),
    staleTime: 50 * 60,
  })
}

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
        `/api/v1/org/products${queryString}`
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
