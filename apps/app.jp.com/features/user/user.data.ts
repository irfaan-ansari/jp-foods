"use client"

import { AppError, fetcher } from "@jp/utils"

import { useQuery } from "@tanstack/react-query"
import type { PaginatedResponse } from "@/features/shared/shared.type"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import type { User } from "./user.type"

export const useUsers = (kv?: Record<string, any>) => {
  const { getQueryString } = useRouterStuff()
  const queryString = getQueryString(kv)

  return useQuery<PaginatedResponse<User>, AppError>({
    queryKey: ["users", queryString],
    queryFn: () => fetcher(`/api/v1/users${queryString}`),
    staleTime: 1000 * 60 * 5,
  })
}
