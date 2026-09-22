import { AppError } from "@jp/utils"
import { apiClient } from "@/lib/api-client"
import { useQuery } from "@tanstack/react-query"
import {
  ApiResponse,
  PaginatedResponse,
} from "@/features/shared/shared.type"
import { CatalogInquiry } from "./catalog.type"

export const useCatalogInquiries = (kv?: Record<string, any>) => {
  return useQuery<PaginatedResponse<CatalogInquiry>, AppError>({
    queryKey: ["catalog-inquiry", kv],
    queryFn: () => apiClient.get(`/crm/catalog-inquiries`, { params: kv }),
    staleTime: 1000 * 60 * 5,
  })
}

export const useCatalogInquiry = (id: string) => {
  return useQuery<ApiResponse<CatalogInquiry>, AppError>({
    queryKey: ["catalog-inquiry", id],
    queryFn: () => apiClient.get(`/crm/catalog-inquiries/${id}`),
    staleTime: 1000 * 60 * 5,
  })
}
