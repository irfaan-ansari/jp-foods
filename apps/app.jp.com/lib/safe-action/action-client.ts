import { createSafeActionClient } from "next-safe-action"
import { OrganizationPermission, UserPermission } from "@jp/auth"

import { authMiddleware } from "./middlewares/auth-middleware"
import { orgMiddleware, orgPermission } from "./middlewares/org-middleware"
import { auditLogMiddleware, logMiddleware } from "./middlewares/log-middleware"
import { AppError } from "@jp/utils"

// public
const actionClient = createSafeActionClient({
  handleServerError(error) {
    console.error(error)
    if (error instanceof AppError)
      return {
        code: error.code,
        status: error.status,
        message: error.message,
        description: error.description,
      }

    return {
      code: "error.code",
      status: "error.status",
      message: error.message,
    }
  },
})

// crm
export const authActionClient = (permission: UserPermission) =>
  actionClient
    .use(logMiddleware)
    .use(authMiddleware(permission))
    .use(auditLogMiddleware)

// organization
export const orgActionClient = (permission: OrganizationPermission) =>
  authActionClient({ portal: ["organization"] })
    .use(orgMiddleware)
    .use(orgPermission(permission))
