import { createMiddleware } from "hono/factory"

import type { OrganizationPermission } from "@jp/auth"
import { hasOrgPermission } from "@/features/auth"
import type { OrgAppContext } from "./context"
import { AppError } from "@jp/utils"

export const orgMiddleware = createMiddleware<OrgAppContext>(
  async (c, next) => {
    const session = c.get("session")

    const organizationId = session?.activeOrganizationId

    if (!organizationId) {
      throw new AppError("FORBIDDEN")
    }

    c.set("organizationId", organizationId)

    await next()
  }
)

export const orgPermission = (permission: OrganizationPermission) =>
  createMiddleware<OrgAppContext>(async (c, next) => {
    const { success } = await hasOrgPermission({
      ...permission,
    })

    if (!success) {
      throw new AppError("FORBIDDEN")
    }

    await next()
  })
