"use server"

import { cache } from "react"
import { headers } from "next/headers"
import {
  auth,
  type UserPermission,
  type OrganizationPermission,
} from "@jp/auth"

export const getSession = cache(async () => {
  return await auth.api.getSession({
    headers: await headers(),
  })
})
export const listDeviceSessions = cache(async () => {
  return await auth.api.listDeviceSessions({ headers: await headers() })
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
