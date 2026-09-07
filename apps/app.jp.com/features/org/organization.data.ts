import { AppError } from "@jp/utils"
import { useQuery } from "@tanstack/react-query"
import { ApiResponse } from "../shared/shared.type"
import { Organization } from "./organization.types"
import { OrganizationPermission } from "@jp/auth"
import { authClient } from "@jp/auth/client"
import { apiClient } from "@/lib/api-client"

export const useOrganization = () => {
  return useQuery<ApiResponse<Organization>, AppError>({
    queryKey: ["organization"],
    queryFn: () => apiClient.get("/org/"),
    staleTime: 50 * 100 * 5,
  })
}

export const useOrgPermission = (permission: OrganizationPermission) => {
  return useQuery({
    queryKey: ["org-permission", permission],
    queryFn: async () => {
      const { error, data } = await authClient.organization.hasPermission({
        permissions: permission,
      })
      if (error) throw new Error(error.message)
      return data
    },
  })
}
