import { AppError, fetcher } from "@jp/utils"
import { useQuery } from "@tanstack/react-query"
import { ApiResponse } from "../shared/shared.type"
import { Organization } from "./organization.types"
import { OrganizationPermission } from "@jp/auth"
import { authClient } from "@jp/auth/client"

export const useOrganization = () => {
  return useQuery<ApiResponse<Organization>, AppError>({
    queryKey: ["organization"],
    queryFn: () => fetcher("/api/v1/org/"),
    staleTime: 50 * 100 * 5,
  })
}

export const useOrgPermission = (permission: OrganizationPermission) => {
  return useQuery({
    queryKey: ["org-permission", permission],
    queryFn: () =>
      authClient.organization.hasPermission({
        permissions: permission,
      }),
  })
}
