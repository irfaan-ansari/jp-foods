import { createMiddleware } from "next-safe-action"
import { auth, UserPermission } from "@jp/auth"
import { hasPermission } from "@/features/auth/auth.data"
import { AppError } from "@jp/utils"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

export const authMiddleware = (permission: UserPermission) =>
  createMiddleware().define(async ({ next }) => {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
      redirect("http://localhost:3000/signin")
    }

    const { userId } = session.session

    const { success: hasAccess } = await hasPermission({
      userId,
      ...permission,
    })

    if (!hasAccess) {
      throw new AppError("FORBIDDEN")
    }

    return next({
      ctx: {
        ...session,
      },
    })
  })
