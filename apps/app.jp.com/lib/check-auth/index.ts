"use server"

import { headers } from "next/headers"
import { auth, UserPermission } from "@jp/auth"

export const checkAuth = async (permissions?: UserPermission[]) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return {
      session: null,
      authenticated: false,
      authorized: false,
    }
  }

  if (!permissions?.length) {
    return {
      session,
      authenticated: true,
      authorized: true,
    }
  }

  const results = await Promise.all(
    permissions.map((permission) =>
      auth.api.userHasPermission({
        body: {
          userId: session.user.id,
          permissions: permission,
        },
      })
    )
  )

  const authorized = results.some((result) => result.success)

  return {
    session,
    authenticated: true,
    authorized,
  }
}
