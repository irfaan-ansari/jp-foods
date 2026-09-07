import { AppError, fetcher } from "@jp/utils"
import { useQuery } from "@tanstack/react-query"
import { CustomerApplication, CustomerInvite } from "./customer.type"
import { ApiResponse, PaginatedResponse } from "@/features/shared/shared.type"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"

export const useCustomerApplications = (kv?: Record<string, any>) => {
  const { getQueryString } = useRouterStuff()
  const queryString = getQueryString(kv)

  return useQuery<PaginatedResponse<CustomerApplication>, AppError>({
    queryKey: ["customer-application", kv],
    queryFn: () => fetcher(`/api/v1/crm/customers${queryString}`),
    staleTime: 1000 * 60 * 5,
  })
}
export const useCustomerApplication = (id: string) => {
  return useQuery<ApiResponse<CustomerApplication>, AppError>({
    queryKey: ["customer-application", id],
    queryFn: () => fetcher(`/api/v1/crm/customers/${id}`),
    staleTime: 1000 * 60 * 5,
  })
}

export const useCustomerInvites = (kv?: Record<string, any>) => {
  const { getQueryString } = useRouterStuff()
  const queryString = getQueryString(kv)

  return useQuery<PaginatedResponse<CustomerInvite>, AppError>({
    queryKey: ["customer-invites", kv],
    queryFn: () => fetcher(`/api/v1/crm/customers/invites${queryString}`),
    staleTime: 1000 * 60 * 5,
  })
}
