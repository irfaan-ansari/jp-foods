"use client"

import type { OrganizationPermission, UserPermission } from "@jp/auth"
import { authClient } from "@jp/auth/client"
import { useQuery } from "@tanstack/react-query"

export const useUserPermission = ({ ...permissions }: UserPermission) => {
  const { data, isPending, error } = authClient.useSession()

  const disabled = !data || isPending || error

  return useQuery({
    queryKey: ["permissions", permissions],
    queryFn: async () =>
      await authClient.admin.hasPermission({
        userId: data?.user.id,
        permissions,
      }),
    enabled: !disabled,
    staleTime: 60 * 60 * 1000,
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
    staleTime: 60 * 60 * 1000,
  })
}
