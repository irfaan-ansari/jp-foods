"use client"
import { type AppError, fetcher } from "@jp/utils"
import { useQuery } from "@tanstack/react-query"
import { ApiResponse } from "../shared/shared.type"
import type { ActiveTeam, Team } from "./team.type"
import { queryOptions } from "@tanstack/react-query"

export const teamQueryOptions = queryOptions({
  queryKey: ["active-team"],
  queryFn: () => fetcher<ApiResponse<ActiveTeam>>("/api/v1/team/active"),
  staleTime: Infinity,
  gcTime: Infinity,
  refetchOnWindowFocus: false,
})

export const useActiveTeam = () => {
  return useQuery(teamQueryOptions)
}

export const useTeams = () => {
  return useQuery<ApiResponse<Team[]>, AppError>({
    queryKey: ["teams"],
    queryFn: () => fetcher("/api/v1/team/list"),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}
