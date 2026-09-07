"use client"
import { UserPermission } from "@jp/auth"
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
  })
}
