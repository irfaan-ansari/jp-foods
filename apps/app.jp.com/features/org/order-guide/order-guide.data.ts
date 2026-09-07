import { useQuery } from "@tanstack/react-query"
import { PaginatedResponse } from "../../shared/shared.type"
import { AppError } from "@jp/utils"
import type { OrderGuide } from "./order-guide.type"
import { apiClient } from "@/lib/api-client"

export const useOrderGuides = (kv?: Record<string, any>) => {
  return useQuery<PaginatedResponse<OrderGuide>, AppError>({
    queryKey: ["order-guides", kv],
    queryFn: () =>
      apiClient.get(`/org/order-guides`, {
        params: kv,
      }),
    staleTime: 1000 * 60 * 5,
  })
}
