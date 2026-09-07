"use client"

import { useQuery } from "@tanstack/react-query"

import { AppError, fetcher } from "@jp/utils"
import { getBlob } from "./shared.action"

export type Status = Record<string, string | number>

export const useCount = (path: string) => {
  return useQuery<{ data: Status }, AppError>({
    queryKey: ["count", path],
    queryFn: () => fetcher(path),
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
