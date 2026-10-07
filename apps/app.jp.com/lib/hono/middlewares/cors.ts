import { cors } from "hono/cors"
import { TRUSTED_ORIGINS } from "@jp/utils/env"

export const corsMiddleware = cors({
  origin: (origin) => {
    if (!origin) return ""

    return TRUSTED_ORIGINS.includes(origin) ? origin : ""
  },
  credentials: true,
  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
})
