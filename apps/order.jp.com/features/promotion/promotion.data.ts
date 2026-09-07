import { useQuery } from "@tanstack/react-query"
import { ApiResponse } from "../shared/shared.type"
import { AppError } from "@jp/utils"
import { Promotion } from "./promotion.type"
import { apiClient } from "@/lib/api-client"

export const usePromotions = () => {
  return useQuery<ApiResponse<Promotion[]>, AppError>({
    queryKey: ["promotions"],
    queryFn: () => apiClient.get("/promotions"),
  })
}
