import { AppError, fetcher } from "@jp/utils"
import { useQuery } from "@tanstack/react-query"
import { CandiateApplication } from "./candidate.type"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { ApiResponse, PaginatedResponse } from "@/features/shared/shared.type"

export const useCandidateApplications = (kv?: Record<string, any>) => {
  const { getQueryString } = useRouterStuff()
  const queryString = getQueryString(kv)

  return useQuery<PaginatedResponse<CandiateApplication>, AppError>({
    queryKey: ["candidate-applications", kv],
    queryFn: () => fetcher(`/api/v1/crm/candidates${queryString}`),
    staleTime: 1000 * 60 * 5,
  })
}

export const useCandidateApplication = (id: string) => {
  return useQuery<ApiResponse<CandiateApplication>, AppError>({
    queryKey: ["candidate-application", id],
    queryFn: () => fetcher(`/api/v1/crm/candidates/${id}`),
    staleTime: 1000 * 60 * 5,
  })
}
