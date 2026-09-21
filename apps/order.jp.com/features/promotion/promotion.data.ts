import { useQuery } from "@tanstack/react-query"
import { ApiResponse } from "../shared/shared.type"
import { AppError } from "@jp/utils"
import { Promotion } from "./promotion.type"
import { apiClient } from "@/lib/api-client"

export const usePromotions = (kv?: Record<string, any>) => {
  return useQuery<ApiResponse<Promotion[]>, AppError>({
    queryKey: ["promotions", kv],
    queryFn: () =>
      apiClient.get("/promotions", {
        params: kv,
      }),
  })
}
