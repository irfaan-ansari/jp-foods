import { AppError } from "@jp/utils"
import { useQuery } from "@tanstack/react-query"
import { PaginatedResponse } from "../../shared/shared.type"
import { TaxRule } from "./tax-rule.type"
import { apiClient } from "@/lib/api-client"

export const useTaxRules = (kv?: Record<string, any>) => {
  return useQuery<PaginatedResponse<TaxRule>, AppError>({
    queryKey: ["tax-rules", kv],
    queryFn: () => apiClient.get(`/org/tax-rules`, { params: kv }),
    staleTime: 1000 * 60 * 5,
  })
}
