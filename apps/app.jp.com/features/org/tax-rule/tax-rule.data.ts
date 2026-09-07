import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { AppError, fetcher } from "@jp/utils"
import { useQuery } from "@tanstack/react-query"
import { PaginatedResponse } from "../../shared/shared.type"
import { TaxRule } from "./tax-rule.type"

export const useTaxRules = (kv?: Record<string, any>) => {
  const { getQueryString } = useRouterStuff()
  const queryString = getQueryString(kv)

  return useQuery<PaginatedResponse<TaxRule>, AppError>({
    queryKey: ["tax-rules", queryString],
    queryFn: () => fetcher(`/api/v1/org/tax-rules${queryString}`),
    staleTime: 1000 * 60 * 5,
  })
}
