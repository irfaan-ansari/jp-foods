import { Hono } from "hono"
import { customerInvite, db } from "@jp/db"
import { AppError } from "@jp/utils"
import { AppContext } from "@/lib/hono/middlewares"
import { and, count, eq, ilike, or } from "drizzle-orm"
import { parsePagination, getStatusCounts } from "@/lib/hono/lib"

const app = new Hono<AppContext>()

export const catalogInquiryRoutes = app
  .get("/", async (c) => {
    const { q, status = "", ...rest } = c.req.query()
    const { page, limit, offset } = parsePagination(rest)

    const conditions = []

    conditions.push(eq(customerInvite.type, "request"))

    if (status) {
      conditions.push(eq(customerInvite.status, status))
    }
    if (q) {
      conditions.push(
        or(
          ilike(customerInvite.companyName, `%${q}%`),
          ilike(customerInvite.companyType, `%${q}%`),
          ilike(customerInvite.firstName, `%${q}%`),
          ilike(customerInvite.email, `%${q}%`)
        )
      )
    }

    const [response, total] = await Promise.all([
      db.query.customerInvite.findMany({
        where: and(...conditions),
        limit,
        offset,
        orderBy: (c, { desc }) => [desc(c.createdAt)],
      }),
      db.$count(customerInvite, and(...conditions)),
    ])

    const withLink = response.map((item) => ({
      ...item,
      url: item.token
        ? `${process.env.BETTER_AUTH_URL}/api/v1/products/access?token=${item.token}&redirect=${process.env.JP_APP_URL}/products`
        : "",
    }))
    return c.json({
      success: true,
      data: withLink,
      pagination: {
        page: page,
        limit: limit,
        total: total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    })
  })
  // catalog request count
  .get("/count", async (c) => {
    const result = await db
      .select({
        status: customerInvite.status,
        value: count(),
      })
      .from(customerInvite)
      .where(eq(customerInvite.type, "request"))
      .groupBy(customerInvite.status)

    const counts = getStatusCounts(result)

    return c.json({
      success: true,
      data: counts,
    })
  })
  // get catalog request by id
  .get("/:id", async (c) => {
    const id = c.req.param("id")

    const response = await db.query.customerInvite.findFirst({
      where: (c, { and, eq }) =>
        and(eq(c.id, Number(id)), eq(c.type, "request")),
    })

    if (!response) throw new AppError("NOT_FOUND")

    const { token, ...inquiry } = response

    return c.json({
      success: true,
      data: {
        ...inquiry,
        url: token
          ? `${process.env.BETTER_AUTH_URL}/api/v1/products/access?token=${token}&redirect=${process.env.JP_APP_URL}/products`
          : "",
      },
    })
  })
