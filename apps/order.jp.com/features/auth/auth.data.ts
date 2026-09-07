"use server"
import { cache } from "react"
import { auth, OrganizationPermission, UserPermission } from "@jp/auth"
import { headers } from "next/headers"

export const getSession = cache(async () => {
  return await auth.api.getSession({ headers: await headers() })
})

export const hasPermission = cache(
  async (props: UserPermission & { userId: string }) => {
    const { userId, ...permissions } = props
    return await auth.api.userHasPermission({
      body: {
        userId,
        permissions,
      },
    })
  }
)

export const hasOrgPermission = cache(
  async (permissions: OrganizationPermission) => {
    return await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions,
      },
    })
  }
)
