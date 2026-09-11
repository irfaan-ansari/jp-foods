"use client"

import { AppError } from "@jp/utils"
import { getBlob } from "./shared.action"
import { apiClient } from "@/lib/api-client"
import { useQuery } from "@tanstack/react-query"

export type Status = Record<string, string | number>

export const useCount = (path: string) => {
  return useQuery<{ data: Status }, AppError>({
    queryKey: ["count", path],
    queryFn: () => apiClient.get(path),
    staleTime: 1000 * 60 * 5,
  })
}

export const useVercelBlob = (url: string) => {
  return useQuery({
    queryKey: ["blob", url],
    queryFn: () => getBlob(url),
    staleTime: 1000 * 60 * 5,
  })
}
