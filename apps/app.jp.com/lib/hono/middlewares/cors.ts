import { cors } from "hono/cors"

const origins = (process.env.BETTER_AUTH_ORIGINS ?? "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean)

export const corsMiddleware = cors({
  origin: (origin) => {
    if (!origin) return ""

    return origins.includes(origin) ? origin : ""
  },
  credentials: true,
  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
})
