"use client"

import { type AppError } from "@jp/utils"
import { useQuery } from "@tanstack/react-query"
import { ApiResponse } from "../shared/shared.type"
import { Member } from "./member.type"

import { apiClient } from "@/lib/api-client"

export const useTeamMembers = (kv?: Record<string, any>) => {
  return useQuery<ApiResponse<Member[]>, AppError>({
    queryKey: ["members", kv],
    queryFn: () =>
      apiClient.get("/members", {
        params: kv,
      }),
    staleTime: 1000 * 60 * 5,
  })
}
