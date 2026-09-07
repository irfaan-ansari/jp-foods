import { AppError } from "@jp/utils"
import { createSafeActionClient } from "next-safe-action"
import { authMiddleware } from "./middlewares/auth-middleware"
import { OrganizationPermission, UserPermission } from "@jp/auth"
import { orgMiddleware, orgPermission } from "./middlewares/org-middleware"
import { auditLogMiddleware, logMiddleware } from "./middlewares/log-middleware"

export const actionClient = createSafeActionClient({
  handleServerError(error) {
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

// const authActionClient = (permission: UserPermission) =>
//   actionClient
//     .use(logMiddleware)
//     .use(authMiddleware(permission))
//     .use(auditLogMiddleware)

// export const orgActionClient = (permission: OrganizationPermission) =>
//   authActionClient({ portal: ["customer"] })
//     .use(orgMiddleware)
//     .use(orgPermission(permission))
