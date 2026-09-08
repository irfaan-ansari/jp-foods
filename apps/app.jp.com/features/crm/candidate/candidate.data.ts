import { AppError } from "@jp/utils"
import { useQuery } from "@tanstack/react-query"
import { CandidateApplication } from "./candidate.type"
import { ApiResponse, PaginatedResponse } from "@/features/shared/shared.type"
import { apiClient } from "@/lib/api-client"

export const useCandidateApplications = (kv?: Record<string, any>) => {
  return useQuery<PaginatedResponse<CandidateApplication>, AppError>({
    queryKey: ["candidate-applications", kv],
    queryFn: () => apiClient.get(`/crm/candidates`, { params: kv }),
    staleTime: 1000 * 60 * 5,
  })
}

export const useCandidateApplication = (id: string) => {
  return useQuery<ApiResponse<CandidateApplication>, AppError>({
    queryKey: ["candidate-application", id],
    queryFn: () => apiClient.get(`/crm/candidates/${id}`),
    staleTime: 1000 * 60 * 5,
  })
}
