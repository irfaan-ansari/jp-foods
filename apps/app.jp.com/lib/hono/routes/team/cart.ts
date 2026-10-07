import { Hono } from "hono"

import type { TeamAppContext } from "@/lib/hono/middlewares"
import { publishCartEvent } from "@/features/org/cart/cart.service"

export const cart = new Hono<TeamAppContext>().post("/", async (c) => {
  const organizationId = c.get("organizationId")
  const teamId = c.get("teamId")
  const user = c.get("user")
  const body = await c.req.json().catch(() => ({}))

  const subscribers = await publishCartEvent({
    organizationId,
    teamId,
    userId: user.id,
    event: body,
  })

  return c.json({
    success: true,
    data: { subscribers },
  })
})
