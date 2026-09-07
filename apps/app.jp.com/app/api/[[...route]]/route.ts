import { Hono } from "hono"
import { handle } from "hono/vercel"
import { logger } from "hono/logger"

import { auth } from "@jp/auth"

import {
  corsMiddleware,
  errorHandler,
  AppContext,
} from "@/lib/hono/middlewares"
import { v1 } from "@/lib/hono"

const app = new Hono<AppContext>({ strict: false }).basePath("/api")

app.use(logger())

/** cors */
app.use("*", corsMiddleware)

/** better-auth routes */
app.on(["POST", "GET"], "/auth/*", (c) => {
  return auth.handler(c.req.raw)
})

/** routes */
app.route("/v1", v1)

// global error handler
app.onError(errorHandler)

export const GET = handle(app)
export const POST = handle(app)
export const DELETE = handle(app)
export const PUT = handle(app)
export const PATCH = handle(app)
export const OPTIONS = handle(app)

export type AppType = typeof app
