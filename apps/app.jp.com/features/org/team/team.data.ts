"use client"

import { AppError, fetcher } from "@jp/utils"

import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import type { PaginatedResponse } from "@/features/shared/shared.type"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import type { Team } from "@/features/org/team/team.type"

export const useTeams = (kv?: Record<string, any>) => {
  const { getQueryString } = useRouterStuff()
  const queryString = getQueryString(kv)

  return useQuery<PaginatedResponse<Team>, AppError>({
    queryKey: ["teams", queryString],
    queryFn: () => fetcher(`/api/v1/org/teams${queryString}`),
    staleTime: 1000 * 60 * 5,
  })
}

export const useInfiniteTeams = (kv?: Record<string, any>) => {
  const { getQueryString } = useRouterStuff()

  return useInfiniteQuery({
    queryKey: ["teams", kv],
    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      const queryString = getQueryString({
        ...kv,
        page: pageParam,
      })

      return fetcher<PaginatedResponse<Team>>(`/api/v1/org/teams${queryString}`)
    },

    getNextPageParam: (lastPage) => {
      return lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined
    },

    staleTime: 1000 * 60 * 5,
  })
}
