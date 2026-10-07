import { Hono } from "hono"
import { db, user } from "@jp/db"
import { AppError } from "@jp/utils"
import { and, count, eq, ilike, or } from "drizzle-orm"
import { parsePagination, getStatusCounts } from "@/lib/hono/lib"
import { AppContext, authMiddleware } from "@/lib/hono/middlewares"

export const userRoutes = new Hono<AppContext>()
  .use("*", authMiddleware({ user: ["list"] }))
  .get("/", async (c) => {
    const { q, status, role, ...rest } = c.req.query()
    const { page, limit, offset } = parsePagination(rest)

    const conditions = []
    if (role) {
      conditions.push(eq(user.role, role))
    }
    if (status) {
      conditions.push(eq(user.banned, status === "banned"))
    }
    if (q) {
      conditions.push(
        or(
          ilike(user.email, `%${q}%`),
          ilike(user.name, `%${q}%`),
          ilike(user.phoneNumber, `%${q}%`)
        )
      )
    }

    const [response, total] = await Promise.all([
      db.query.user.findMany({
        where: and(...conditions),
        limit,
        offset,
        orderBy: (u, { desc }) => [desc(u.createdAt), desc(u.id)],
      }),
      db.$count(user, and(...conditions)),
    ])

    return c.json({
      success: true,
      data: response,
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
  .get("/:id", async (c) => {
    const id = c.req.param("id")

    const response = await db.query.user.findFirst({
      where: (u, { eq }) => eq(u.id, id),
    })

    if (!response) throw new AppError("NOT_FOUND")

    return c.json({
      success: true,
      data: {
        ...response,
      },
    })
  })
