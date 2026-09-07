import { useQuery } from "@tanstack/react-query"
import { ApiResponse } from "../shared/shared.type"
import { AppError, fetcher } from "@jp/utils"
import { Promotion } from "./promotion.type"

export const usePromotions = () => {
  return useQuery<ApiResponse<Promotion[]>, AppError>({
    queryKey: ["promotions"],
    queryFn: () => fetcher(`/api/v1/team/promotions`),
  })
}
