"use client"

import { useQuery } from "@tanstack/react-query"

import { AppError, fetcher } from "@jp/utils"

export type Status = Record<string, string | number>

export const useCount = (path: string) => {
  return useQuery<{ data: Status }, AppError>({
    queryKey: ["count", path],
    queryFn: () => fetcher(path),
    staleTime: 50 * 60,
  })
}
