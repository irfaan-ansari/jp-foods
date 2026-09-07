import { Hono } from "hono"
import { OrgAppContext, orgPermission } from "@/lib/hono/middlewares"
import { db, taxRule, team } from "@jp/db"
import { parsePagination } from "@jp/utils"
import { and, count, eq, ilike, inArray, or, SQL } from "drizzle-orm"

const app = new Hono<OrgAppContext>()

app.use("/", orgPermission({ taxRule: ["read"] }))

export const taxRulesRoutes = app
  .get("/", async (c) => {
    const organizationId = c.get("organizationId")!

    const { q, status, ...rest } = c.req.query()
    const { page, limit, offset } = parsePagination(rest)

    const conditions = [eq(taxRule.organizationId, organizationId)]

    if (q)
      conditions.push(
        or(
          ilike(taxRule.name, `%${q}%`),
          ilike(taxRule.rate, `%${q}%`)
        ) as SQL<unknown>
      )

    const filters = and(...conditions)

    const [response, total] = await Promise.all([
      db.query.taxRule.findMany({
        where: filters,
        limit: Number(limit),
        offset,
        orderBy: (order, { desc }) => [desc(order.createdAt)],
      }),

      db.$count(taxRule, filters),
    ])

    const customerCounts = await db
      .select({
        taxRuleId: team.taxRuleId,
        count: count(),
      })
      .from(team)
      .where(
        inArray(
          team.taxRuleId,
          response.map((p) => p.id)
        )
      )
      .groupBy(team.taxRuleId)

    const counts = new Map(customerCounts.map((c) => [c.taxRuleId, c.count]))

    const transformed = response.map((res) => ({
      ...res,
      customerCount: counts.get(res.id) ?? 0,
    }))

    return c.json({
      success: true,
      data: transformed,
      pagination: {
        page: page,
        limit: limit,
        total: total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    })
  })
  /** get count */
  .get("/count", orgPermission({ taxRule: ["read"] }), async (c) => {
    const organizationId = c.get("organizationId")!

    const result = await db.$count(
      taxRule,
      eq(taxRule.organizationId, organizationId)
    )

    return c.json({
      success: true,
      data: {
        all: result,
      },
    })
  })
