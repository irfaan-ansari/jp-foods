"use client"
import { type AppError } from "@jp/utils"
import { useQuery } from "@tanstack/react-query"
import { ApiResponse } from "../shared/shared.type"
import type { ActiveTeam, Team } from "./team.type"
import { queryOptions } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"

export const teamQueryOptions = queryOptions({
  queryKey: ["active-team"],
  queryFn: () => apiClient.get<ApiResponse<ActiveTeam>>("/active"),
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
    queryFn: () => apiClient.get("/list"),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}
