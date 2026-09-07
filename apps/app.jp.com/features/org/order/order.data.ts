"use client"

import { AppError } from "@jp/utils"
import { useQuery } from "@tanstack/react-query"
import type {
  PaginatedResponse,
  ApiResponse,
} from "@/features/shared/shared.type"
import type { Order } from "@/features/org/order/order.type"
import { apiClient } from "@/lib/api-client"

export const useOrders = (kv?: Record<string, any> | undefined) => {
  return useQuery<PaginatedResponse<Order>, AppError>({
    queryKey: ["orders", kv],
    queryFn: () =>
      apiClient.get(`/org/orders`, {
        params: kv,
      }),
    staleTime: 50 * 60,
  })
}

export const useOrder = (id: string | number) => {
  return useQuery<ApiResponse<Order>, AppError>({
    queryKey: ["orders", id],
    queryFn: () => apiClient.get(`/org/orders/${id}`),
    staleTime: 50 * 60,
  })
}
