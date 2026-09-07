import { auth, type UserPermission } from "@jp/auth"
import { createMiddleware } from "hono/factory"
import { AppContext } from "./context"
import { hasPermission } from "@/features/auth"
import { AppError } from "@jp/utils"

export const authMiddleware = (permission: UserPermission) =>
  createMiddleware<AppContext>(async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers })

    if (!session) {
      throw new AppError("UNAUTHORIZED")
    }
    const { userId } = session.session

    const { success } = await hasPermission({
      userId,
      ...permission,
    })

    if (!success) {
      throw new AppError("FORBIDDEN")
    }

    c.set("user", session.user)
    c.set("session", session.session)

    await next()
  })
