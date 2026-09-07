import { AuthContext } from "../types"
import { createMiddleware } from "next-safe-action"

export const logMiddleware = createMiddleware().define(
  async ({ next, metadata, clientInput }) => {
    const startedAt = Date.now()

    console.info("server_action.started:", {
      action: metadata?.actionName,
      input: clientInput,
    })

    try {
      const result = await next()

      console.info("server_action.completed:", {
        action: metadata?.name,
        duration: Date.now() - startedAt,
      })

      return result
    } catch (error) {
      console.error("server_action.failed:", {
        action: metadata?.name,
        duration: Date.now() - startedAt,
        error,
      })

      throw error
    }
  }
)

export const auditLogMiddleware = createMiddleware<{
  ctx: AuthContext
}>().define(async ({ next, ctx, metadata }) => {
  console.info("server_action.authenticated", {
    action: metadata?.name,
    user: ctx.user,
    session: ctx.session,
  })

  return next()
})
