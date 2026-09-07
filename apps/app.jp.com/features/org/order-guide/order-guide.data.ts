import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { useQuery } from "@tanstack/react-query"
import { PaginatedResponse } from "../../shared/shared.type"
import { AppError, fetcher } from "@jp/utils"
import type { OrderGuide } from "./order-guide.type"

export const useOrderGuides = (kv?: Record<string, any>) => {
  const { getQueryString } = useRouterStuff()
  const queryString = getQueryString(kv)

  return useQuery<PaginatedResponse<OrderGuide>, AppError>({
    queryKey: ["order-guides", queryString],
    queryFn: () => fetcher(`/api/v1/org/order-guides${queryString}`),
    staleTime: 1000 * 60 * 5,
  })
}
