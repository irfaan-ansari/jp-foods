"use client"

import { type AppError, fetcher } from "@jp/utils"
import { useQuery } from "@tanstack/react-query"
import { ApiResponse } from "../shared/shared.type"
import { Member } from "./member.type"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"

export const useTeamMembers = (kv?: Record<string, any>) => {
  const { getQueryString } = useRouterStuff()
  const queryString = getQueryString(kv)

  return useQuery<ApiResponse<Member[]>, AppError>({
    queryKey: ["members"],
    queryFn: () => fetcher(`/api/v1/team/members${queryString}`),
    staleTime: 1000 * 60 * 5,
  })
}
