import { AppError } from "@jp/utils"
import { PriceLevel } from "./price-level.type"
import { apiClient } from "@/lib/api-client"
import { useQuery } from "@tanstack/react-query"
import { PaginatedResponse } from "@/features/shared/shared.type"

export const usePriceLevels = (kv?: Record<string, any>) => {
  return useQuery<PaginatedResponse<PriceLevel>, AppError>({
    queryKey: ["price-levels", kv],
    queryFn: () =>
      apiClient.get(`/org/price-levels`, {
        params: kv,
      }),
    staleTime: 1000 * 60 * 5,
  })
}
