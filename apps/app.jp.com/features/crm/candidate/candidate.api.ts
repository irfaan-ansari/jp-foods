import { Hono } from "hono"
import { db, jobApplication } from "@jp/db"
import { AppError } from "@jp/utils"
import { AppContext } from "@/lib/hono/middlewares"
import { and, count, eq, ilike, or } from "drizzle-orm"
import { parsePagination, getStatusCounts } from "@/lib/hono/lib"

const app = new Hono<AppContext>()

export const jobApplicationRoutes = app
  .get("/", async (c) => {
    const { q, status = "", ...rest } = c.req.query()
    const { page, limit, offset } = parsePagination(rest)

    const conditions = []

    if (status) {
      conditions.push(eq(jobApplication.status, status))
    }
    if (q) {
      conditions.push(
        or(
          ilike(jobApplication.applicantName, `%${q}%`),
          ilike(jobApplication.phone, `%${q}%`),
          ilike(jobApplication.email, `%${q}%`),
          ilike(jobApplication.position, `%${q}%`),
          ilike(jobApplication.location, `%${q}%`)
        )
      )
    }

    const [response, total] = await Promise.all([
      db.query.jobApplication.findMany({
        where: and(...conditions),
        limit,
        offset,
        orderBy: (c, { desc }) => [desc(c.createdAt)],
      }),
      db.$count(jobApplication, and(...conditions)),
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
  // application count
  .get("/count", async (c) => {
    const result = await db
      .select({
        status: jobApplication.status,
        value: count(),
      })
      .from(jobApplication)

      .groupBy(jobApplication.status)

    const counts = getStatusCounts(result)

    return c.json({
      success: true,
      data: counts,
    })
  })

  // get application by id
  .get("/:id", async (c) => {
    const id = c.req.param("id")

    const response = await db.query.jobApplication.findFirst({
      where: (c, { eq }) => eq(c.id, Number(id)),
    })

    if (!response) throw new AppError("NOT_FOUND")

    return c.json({
      success: true,
      data: response,
    })
  })
