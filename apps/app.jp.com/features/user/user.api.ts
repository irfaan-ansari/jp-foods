import { Hono } from "hono"
import { db, session, user } from "@jp/db"
import { count, inArray, max } from "drizzle-orm"
import { parsePagination, getStatusCounts } from "@/lib/hono/lib"
import { AppContext, authMiddleware } from "@/lib/hono/middlewares"

const app = new Hono<AppContext>()

app.use("*", authMiddleware({ user: ["list"] }))

export const userRoutes = app
  .get("/", async (c) => {
    const { q, status, ...rest } = c.req.query()
    const { page, limit, offset } = parsePagination(rest)

    const [response, total] = await Promise.all([
      db.query.user.findMany({
        limit,
        offset,
        orderBy: (u, { desc }) => [desc(u.createdAt), desc(u.id)],
      }),
      db.$count(user),
    ])

    const userIds = response.map((r) => r.id)

    const latestSession = await db
      .select({
        userId: session.userId,
        lastSession: max(session.createdAt).as("lastSession"),
      })
      .from(session)
      .where(inArray(session.userId, userIds))
      .groupBy(session.userId)

    const lastSessionByUser = new Map(
      latestSession.map((s) => [s.userId, s.lastSession])
    )

    const users = response.map((user) => ({
      ...user,
      lastSession: lastSessionByUser.get(user.id) ?? null,
    }))

    return c.json({
      success: true,
      data: users,
      pagination: {
        page: page,
        limit: limit,
        total: total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    })
  })
  .get("/count", async (c) => {
    const result = await db
      .select({
        status: user.banned,
        value: count(),
      })
      .from(user)
      .groupBy(user.banned)

    const mapped = result.map((u) => ({
      ...u,
      status: u.status ? "banned" : "active",
    }))

    const counts = getStatusCounts(mapped)

    return c.json({
      success: true,
      data: counts,
    })
  })
