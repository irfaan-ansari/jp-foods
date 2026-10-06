"use client"

import { Order, OrderDashboard, Orders } from "./order.type"
import { type AppError } from "@jp/utils"
import { useQuery } from "@tanstack/react-query"
import { ApiResponse, PaginatedResponse } from "../shared/shared.type"
import { apiClient } from "@/lib/api-client"

export const useOrders = (kv?: Record<string, any>) => {
  return useQuery<PaginatedResponse<Orders>, AppError>({
    queryKey: ["orders", kv],
    queryFn: () => apiClient.get("/orders", { params: kv }),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}

export const useOrder = (id: string) => {
  return useQuery<ApiResponse<Order>, AppError>({
    queryKey: ["order", id],
    queryFn: () => apiClient.get(`/orders/${id}`),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}

export const useOrderDashboard = () => {
  return useQuery<ApiResponse<OrderDashboard>, AppError>({
    queryKey: ["orders", "dashboard"],
    queryFn: () => apiClient.get("/orders/dashboard"),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}
