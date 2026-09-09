"use client"

import { AppError } from "@jp/utils"
import type { User } from "./user.type"
import { apiClient } from "@/lib/api-client"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"

import type { PaginatedResponse } from "@/features/shared/shared.type"

export const useUsers = (kv?: Record<string, any>) => {
  return useQuery<PaginatedResponse<User>, AppError>({
    queryKey: ["users", kv],
    queryFn: () => apiClient.get(`/users`, { params: kv }),
    staleTime: 1000 * 60 * 5,
  })
}

export const useInfiniteUsers = (kv?: Record<string, any>) => {
  return useInfiniteQuery({
    queryKey: ["users", kv],
    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      return apiClient.get<PaginatedResponse<User>>(`/users`, {
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
