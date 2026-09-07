import { createMiddleware } from "next-safe-action"
import { hasOrgPermission } from "@/features/auth/auth.action"
import type { OrganizationPermission } from "@jp/auth"
import { AuthContext } from "../types"
import { AppError } from "@jp/utils"

export const orgMiddleware = createMiddleware<{
  ctx: AuthContext
}>().define(async ({ ctx, next }) => {
  const { session } = ctx
  const organizationId = session?.activeOrganizationId

  if (!organizationId) {
    throw new AppError("FORBIDDEN")
  }

  return next({
    ctx: {
      ...ctx,
      organizationId,
    },
  })
})

export const orgPermission = (permission: OrganizationPermission) =>
  createMiddleware<{
    ctx: AuthContext
  }>().define(async ({ next }) => {
    const { success } = await hasOrgPermission(permission)

    if (!success) {
      throw new AppError("FORBIDDEN")
    }

    return next()
  })
