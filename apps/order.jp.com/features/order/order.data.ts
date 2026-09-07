"use client"

import { Order, Orders } from "./order.type"
import { type AppError, fetcher } from "@jp/utils"
import { useQuery } from "@tanstack/react-query"
import { ApiResponse, PaginatedResponse } from "../shared/shared.type"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"

export const useOrders = (kv?: Record<string, any>) => {
  const { getQueryString } = useRouterStuff()
  const queryString = getQueryString(kv)

  return useQuery<PaginatedResponse<Orders>, AppError>({
    queryKey: ["orders", kv],
    queryFn: () => fetcher(`/api/v1/team/orders${queryString}`),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}

export const useOrder = (id: string) => {
  return useQuery<ApiResponse<Order>, AppError>({
    queryKey: ["order", id],
    queryFn: () => fetcher(`/api/v1/team/orders/${id}`),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}

export const ORDER_STATUS = {
  in_progress: {
    label: "In Progress",
    color: "#F59E0B",
  },
  delayed: {
    label: "Delayed",
    color: "#EF4444",
  },
  completed: {
    label: "Completed",
    color: "#22C55E",
  },
  cancelled: {
    label: "Cancelled",
    color: "#EF4444",
  },
}

export const ORDER_CANCEL_REASONS = [
  { value: "Ordered in error", label: "Ordered in error" },
  { value: "Duplicate order", label: "Duplicate order" },
  { value: "Need to modify the order", label: "Need to modify the order" },
  {
    value: "Incorrect products or quantities",
    label: "Incorrect products or quantities",
  },
  {
    value: "Business needs have changed",
    label: "Business needs have changed",
  },
  { value: "Other", label: "Other" },
]
