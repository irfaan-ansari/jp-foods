"use client"

import { AppError } from "@jp/utils"
import { apiClient } from "@/lib/api-client"
import type {
  Team,
  TeamAnalytics,
  TeamDetail,
} from "@/features/org/team/team.type"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import type {
  ApiResponse,
  PaginatedResponse,
} from "@/features/shared/shared.type"

export const useTeams = (kv?: Record<string, any>) => {
  return useQuery<PaginatedResponse<Team>, AppError>({
    queryKey: ["teams", kv],
    queryFn: () => apiClient.get(`/org/teams`, { params: kv }),
    staleTime: 1000 * 60 * 5,
  })
}

export const useInfiniteTeams = (kv?: Record<string, any>) => {
  return useInfiniteQuery({
    queryKey: ["teams", kv],
    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      return apiClient.get<PaginatedResponse<Team>>(`/org/teams`, {
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

export const useTeam = (id: string) => {
  return useQuery<ApiResponse<TeamDetail>, AppError>({
    queryKey: ["teams", id],
    queryFn: () => apiClient.get(`/org/teams/${id}`),
    staleTime: 1000 * 60 * 5,
  })
}
export const useTeamAnalytics = (id: string, kv?: Record<string, any>) => {
  return useQuery<ApiResponse<TeamAnalytics>, AppError>({
    queryKey: ["teams", id, "analytics", kv],
    queryFn: () =>
      apiClient.get(`/org/teams/${id}/analytics`, {
        params: { ...kv },
      }),
    staleTime: 1000 * 60 * 5,
  })
}
