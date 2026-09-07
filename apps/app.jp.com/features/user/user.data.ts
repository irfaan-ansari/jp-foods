"use client"

import { AppError } from "@jp/utils"
import type { User } from "./user.type"
import { apiClient } from "@/lib/api-client"
import { useQuery } from "@tanstack/react-query"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import type { PaginatedResponse } from "@/features/shared/shared.type"

export const useUsers = (kv?: Record<string, any>) => {
  const { getQueryString } = useRouterStuff()
  const queryString = getQueryString(kv)

  return useQuery<PaginatedResponse<User>, AppError>({
    queryKey: ["users", queryString],
    queryFn: () => apiClient.get(`/users`, { params: kv }),
    staleTime: 1000 * 60 * 5,
  })
}
