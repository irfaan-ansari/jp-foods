"use client"

import { AppError, fetcher } from "@jp/utils"

import { useQuery } from "@tanstack/react-query"
import type { PaginatedResponse } from "@/features/shared/shared.type"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import type { Member } from "./member.type"

export const useMembers = (kv?: Record<string, any>) => {
  const { getQueryString } = useRouterStuff()
  const queryString = getQueryString(kv)

  return useQuery<PaginatedResponse<Member>, AppError>({
    queryKey: ["members", queryString],
    queryFn: () => fetcher(`/api/v1/org/members${queryString}`),
    staleTime: 1000 * 60 * 5,
  })
}
