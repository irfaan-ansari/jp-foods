import { Hono } from "hono"

import { AppContext, authMiddleware } from "@/lib/hono/middlewares"

export const driverRoutes = new Hono<AppContext>()
  .use("*", authMiddleware({ portal: ["driver"] }))
  .get("/driver", (c) => {
    return c.json({
      message: "Hello driver route",
    })
  })
