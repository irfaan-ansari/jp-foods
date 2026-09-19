"use server"

import { headers } from "next/headers"
import { auth, UserPermission } from "@jp/auth"

export const checkAuth = async (permissions?: UserPermission) => {
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

  if (!permissions) {
    return {
      session,
      authenticated: true,
      authorized: true,
    }
  }

  const checks = Object.entries(permissions).flatMap(([resource, actions]) =>
    actions.map((action) =>
      auth.api.userHasPermission({
        body: {
          userId: session.user.id,
          permissions: {
            [resource]: [action],
          } as UserPermission,
        },
      })
    )
  )

  const results = await Promise.all(checks)

  const authorized = results.some((result) => result.success)

  return {
    session,
    authenticated: true,
    authorized,
  }
}
