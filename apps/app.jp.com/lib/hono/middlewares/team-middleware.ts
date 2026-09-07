import { AppError } from "@jp/utils"
import type { TeamAppContext } from "./context"
import { createMiddleware } from "hono/factory"
import { hasOrgPermission } from "@/features/auth"
import type { OrganizationPermission } from "@jp/auth"

export const teamMiddleware = createMiddleware<TeamAppContext>(
  async (c, next) => {
    const session = c.get("session")

    const organizationId = session?.activeOrganizationId
    const teamId = session?.activeTeamId

    if (!organizationId || !teamId) {
      throw new AppError("FORBIDDEN")
    }

    c.set("organizationId", organizationId)
    c.set("teamId", teamId)

    await next()
  }
)

export const teamPermission = (permission: OrganizationPermission) =>
  createMiddleware<TeamAppContext>(async (c, next) => {
    const { success } = await hasOrgPermission({
      ...permission,
    })

    if (!success) {
      throw new AppError("FORBIDDEN")
    }

    await next()
  })
