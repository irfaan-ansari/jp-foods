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
        with: {
          priceLevelItem: { with: { product: { with: { sellUnits: true } } } },
        },
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

      const productsMap = new Map<
        number,
        {
          id: number
          title: string
          itemCode: string
          image: string | null
          sellUnits: {
            id: number
            name: string
            basePrice: string | null
            price: string
          }[]
        }
      >()

      for (const priceItem of priceLevelItem) {
        const product = priceItem.product

        const sellUnit = product.sellUnits.find(
          (unit) => unit.id === priceItem.sellUnitId
        )

        if (!sellUnit) continue

        const existing = productsMap.get(product.id)

        productsMap.set(product.id, {
          id: product.id,
          title: product.title,
          itemCode: product.itemCode,
          image: product.image,
          sellUnits: [
            ...(existing?.sellUnits ?? []),
            {
              id: sellUnit.id,
              name: sellUnit.name,
              basePrice: sellUnit.price,
              price: priceItem.price,
            },
          ],
        })
      }

      const products = [...productsMap.values()]

      return {
        ...rest,
        productCount: products.length,
        customerCount: counts.get(item.id) ?? 0,
        products,
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
