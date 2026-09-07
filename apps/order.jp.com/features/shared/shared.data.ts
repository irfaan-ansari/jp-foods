"use client"

import { useQuery } from "@tanstack/react-query"

import { AppError } from "@jp/utils"
import { apiClient } from "@/lib/api-client"

export type Status = Record<string, string | number>

export const useCount = (path: string) => {
  return useQuery<{ data: Status }, AppError>({
    queryKey: ["count", path],
    queryFn: () => apiClient.get(path),
    staleTime: 50 * 60,
  })
}
