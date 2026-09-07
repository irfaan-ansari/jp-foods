import { AppError, fetcher } from "@jp/utils"
import { useQuery } from "@tanstack/react-query"

import { PaginatedResponse } from "@/features/shared/shared.type"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { CatalogInquiry } from "./catalog.type"

export const useCatalogInquiries = (kv?: Record<string, any>) => {
  const { getQueryString } = useRouterStuff()
  const queryString = getQueryString(kv)

  return useQuery<PaginatedResponse<CatalogInquiry>, AppError>({
    queryKey: ["catalog-inquiry", kv],
    queryFn: () => fetcher(`/api/v1/crm/catalog-inquiries${queryString}`),
    staleTime: 1000 * 60 * 5,
  })
}
