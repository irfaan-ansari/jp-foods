import { AppError } from "@jp/utils"
import { useQuery } from "@tanstack/react-query"
import { CustomerApplication, CustomerInvite } from "./customer.type"
import { ApiResponse, PaginatedResponse } from "@/features/shared/shared.type"
import { apiClient } from "@/lib/api-client"

export const useCustomerApplications = (kv?: Record<string, any>) => {
  return useQuery<PaginatedResponse<CustomerApplication>, AppError>({
    queryKey: ["customer-applications", kv],
    queryFn: () =>
      apiClient.get(`/crm/customers`, {
        params: kv,
      }),
    staleTime: 1000 * 60 * 5,
  })
}
export const useCustomerApplication = (id: string) => {
  return useQuery<ApiResponse<CustomerApplication>, AppError>({
    queryKey: ["customer-application", id],
    queryFn: () => apiClient.get(`/crm/customers/${id}`),
    staleTime: 1000 * 60 * 5,
  })
}

export const useCustomerInvites = (kv?: Record<string, any>) => {
  return useQuery<PaginatedResponse<CustomerInvite>, AppError>({
    queryKey: ["customer-invites", kv],
    queryFn: () => apiClient.get(`/crm/customers/invites`, { params: kv }),
    staleTime: 1000 * 60 * 5,
  })
}
