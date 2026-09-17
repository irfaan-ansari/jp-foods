"use client"

import { authClient } from "@jp/auth/client"
import type { AppError } from "@jp/utils"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { useCount } from "@/features/shared/shared.data"
import { useOrders } from "../order/order.data"
import type { ApiResponse } from "@/features/shared/shared.type"
import type { DashboardData } from "./dashboard.type"

export function useDashboardInsights() {
  const { data: session } = authClient.useSession()
  const organizationId = session?.session.activeOrganizationId
  return useQuery<ApiResponse<DashboardData>, AppError>({
    queryKey: ["org-dashboard-insights", organizationId],
    queryFn: () => apiClient.get("/org/dashboard/insights"),
    enabled: !!organizationId,
    staleTime: 0,
    refetchOnWindowFocus: false,
  })
}

export function useDashboard() {
  const ordersCount = useCount("/org/orders/count")
  const productsCount = useCount("/org/products/count")
  const customersCount = useCount("/org/teams/count")
  const orders = useOrders({ limit: 8 })
  const insights = useDashboardInsights()
  const queries = [ordersCount, productsCount, customersCount, orders, insights]
  return {
    ordersCount,
    productsCount,
    customersCount,
    orders,
    insights,
    isFetching: queries.some((query) => query.isFetching),
    refresh: () => Promise.all(queries.map((query) => query.refetch())),
  }
}
