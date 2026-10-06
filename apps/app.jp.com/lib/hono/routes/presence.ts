import { Hono } from "hono"
import type { AppContext } from "../middlewares/context"
import { db, user } from "@jp/db"
import { desc, eq, gte } from "drizzle-orm"
import { authMiddleware } from "../middlewares/auth"

export const presenceRoutes = new Hono<AppContext>()
  .use("*", authMiddleware())
  .post("/", async (c) => {
    const session = c.get("session")
    await db
      .update(user)
      .set({ lastSeenAt: new Date() })
      .where(eq(user.id, session.userId))
    return c.json({ success: true })
  })
  .use("*", authMiddleware({ user: ["list"] }))
  .get("/", async (c) => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)

    const users = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        lastSeenAt: user.lastSeenAt,
      })
      .from(user)
      .where(gte(user.lastSeenAt, fiveMinutesAgo))
      .orderBy(desc(user.lastSeenAt))

    return c.json({ data: users, success: true })
  })
