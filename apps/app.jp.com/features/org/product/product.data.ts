"use client"

import { AppError } from "@jp/utils"

import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import type {
  PaginatedResponse,
  ApiResponse,
} from "@/features/shared/shared.type"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import type { Category, Product } from "@/features/org/product/product.type"
import { apiClient } from "@/lib/api-client"

export const useProducts = (kv?: Record<string, any>) => {
  return useQuery<PaginatedResponse<Product>, AppError>({
    queryKey: ["products", kv],
    queryFn: () =>
      apiClient.get(`/org/products`, {
        params: kv,
      }),
    staleTime: 1000 * 60 * 5,
  })
}

export const useProduct = (id: number | string) => {
  return useQuery<ApiResponse<Product>, AppError>({
    queryKey: ["product", id],
    queryFn: () => apiClient.get(`/org/products/${id}`),
    staleTime: 50 * 60,
  })
}

export const useCategories = (kv?: Record<string, any> | undefined) => {
  return useQuery<PaginatedResponse<Category>, AppError>({
    queryKey: ["categories", kv],
    queryFn: async () =>
      await apiClient.get(`/org/products/categories`, {
        params: kv,
      }),
    staleTime: 50 * 60,
  })
}

export const useInfiniteProducts = (kv?: Record<string, any>) => {
  return useInfiniteQuery({
    queryKey: ["products", kv],
    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      return apiClient.get<PaginatedResponse<Product>>(`/org/products`, {
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
