"use client"

import { AppError } from "@jp/utils"

import type { Member } from "./member.type"
import { apiClient } from "@/lib/api-client"
import { useQuery } from "@tanstack/react-query"
import type {
  ApiResponse,
  PaginatedResponse,
} from "@/features/shared/shared.type"

export const useMembers = (kv?: Record<string, any>) => {
  return useQuery<PaginatedResponse<Member>, AppError>({
    queryKey: ["members", kv],
    queryFn: () =>
      apiClient.get(`/org/members`, {
        params: kv,
      }),
    staleTime: 1000 * 60 * 5,
  })
}

export const useMember = (id: string) => {
  return useQuery<ApiResponse<Member>, AppError>({
    queryKey: ["member", id],
    queryFn: () => apiClient.get(`/org/members/${id}`),
    staleTime: 1000 * 60 * 5,
  })
}
