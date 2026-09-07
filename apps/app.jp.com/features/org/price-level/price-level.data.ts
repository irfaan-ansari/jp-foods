import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { AppError, fetcher } from "@jp/utils"
import { useQuery } from "@tanstack/react-query"
import { PaginatedResponse } from "../../shared/shared.type"
import { PriceLevel } from "./price-level.type"

export const usePriceLevels = (kv?: Record<string, any>) => {
  const { getQueryString } = useRouterStuff()
  const queryString = getQueryString(kv)

  return useQuery<PaginatedResponse<PriceLevel>, AppError>({
    queryKey: ["price-levels", queryString],
    queryFn: () => fetcher(`/api/v1/org/price-levels${queryString}`),
    staleTime: 1000 * 60 * 5,
  })
}
