"use client"

import { AppError, fetcher } from "@jp/utils"
import { useQuery } from "@tanstack/react-query"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import type {
  PaginatedResponse,
  ApiResponse,
} from "@/features/shared/shared.type"
import type { Order } from "@/features/org/order/order.type"

export const useOrders = (kv?: Record<string, any> | undefined) => {
  const { getQueryString } = useRouterStuff()
  const queryString = getQueryString(kv)

  return useQuery<PaginatedResponse<Order>, AppError>({
    queryKey: ["orders", queryString],
    queryFn: () => fetcher(`/api/v1/org/orders${queryString}`),
    staleTime: 50 * 60,
  })
}

export const useOrder = (id: string | number) => {
  return useQuery<ApiResponse<Order>, AppError>({
    queryKey: ["orders", id],
    queryFn: () => fetcher(`/api/v1/org/orders/${id}`),
    staleTime: 50 * 60,
  })
}
