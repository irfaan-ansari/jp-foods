import { Hono } from "hono"
import { OrgAppContext, orgPermission } from "@/lib/hono/middlewares"
import { db, priceLevel, team } from "@jp/db"

import { and, count, eq, ilike, inArray } from "drizzle-orm"
import { parsePagination, getStatusCounts } from "@/lib/hono/lib"

const app = new Hono<OrgAppContext>()

app.use("/", orgPermission({ priceLevel: ["read"] }))

export const priceLevelRoutes = app
  .get("/", async (c) => {
    const organizationId = c.get("organizationId")!

    const { q, status, ...rest } = c.req.query()
    const { page, limit, offset } = parsePagination(rest)

    const conditions = [eq(priceLevel.organizationId, organizationId)]

    if (status) conditions.push(eq(priceLevel.status, status))
    if (q) conditions.push(ilike(priceLevel.name, `%${q}%`))

    const filters = conditions.length > 0 ? and(...conditions) : undefined

    const [response, total] = await Promise.all([
      db.query.priceLevel.findMany({
        where: filters,
        with: { priceLevelItem: { with: { product: true } } },
        limit: Number(limit),
        offset,
        orderBy: (order, { desc }) => [desc(order.createdAt)],
      }),
      db.$count(priceLevel, filters),
    ])

    const customerCounts = await db
      .select({
        priceLevelId: team.priceLevelId,
        count: count(),
      })
      .from(team)
      .where(
        inArray(
          team.priceLevelId,
          response.map((p) => p.id)
        )
      )
      .groupBy(team.priceLevelId)

    const counts = new Map(customerCounts.map((c) => [c.priceLevelId, c.count]))

    const transformed = response.map((item) => {
      const { priceLevelItem, ...rest } = item
      return {
        ...rest,
        productCount: priceLevelItem.length,
        customerCount: counts.get(item.id) ?? 0,
        products: priceLevelItem.map((priceItem) => {
          const { id, title, itemCode, image, basePrice } = priceItem.product
          return {
            id,
            title,
            itemCode,
            image,
            basePrice,
            price: priceItem.price,
          }
        }),
      }
    })

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
  .get("/count", orgPermission({ priceLevel: ["read"] }), async (c) => {
    const organizationId = c.get("organizationId")!

    const result = await db
      .select({
        status: priceLevel.status,
        value: count(),
      })
      .from(priceLevel)
      .where(eq(priceLevel.organizationId, organizationId))
      .groupBy(priceLevel.status)

    const counts = getStatusCounts(result)

    return c.json({
      success: true,
      data: counts,
    })
  })
