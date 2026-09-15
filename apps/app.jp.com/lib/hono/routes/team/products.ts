import { Hono } from "hono"

import { db, product } from "@jp/db"
import {
  and,
  arrayContains,
  eq,
  ilike,
  inArray,
  ne,
  or,
  sql,
} from "drizzle-orm"
import { parsePagination } from "@/lib/hono/lib"
import { TeamAppContext } from "@/lib/hono/middlewares"
import { resolveTeamPrices } from "@/features/org/price-level/price-level-resolver"

const app = new Hono<TeamAppContext>()

export const products = app
  .get("/", async (c) => {
    const teamId = c.get("teamId")
    const organizationId = c.get("organizationId")
    const { q, status, cat, ...rest } = c.req.query()
    const { page, limit, offset } = parsePagination(rest)

    /** get private products */
    const ids = await db.query.teamProduct.findMany({
      where: (tp, { eq }) => eq(tp.teamId, teamId),
      columns: {
        productId: true,
      },
    })

    const privateIds = ids.map((id) => id.productId)

    /** build filters */
    const filters = [
      ne(product.status, "archived"),
      eq(product.organizationId, organizationId),
      or(eq(product.status, "active"), inArray(product.id, privateIds)),
    ]
    if (cat) {
      filters.push(arrayContains(product.categories, [cat]))
    }
    if (q) {
      filters.push(ilike(product.searchText, `%${q}%`))
    }

    const [results, total] = await Promise.all([
      db.query.product.findMany({
        where: and(...filters),
        with: {
          lineItems: {
            columns: {
              id: true,
              orderId: true,
              quantity: true,
              createdAt: true,
            },
            limit: 1,
            orderBy: (li, { desc }) => [desc(li.createdAt)],
          },
          sellUnits: true,
        },
        limit,
        offset,
      }),
      db.$count(product, and(...filters)),
    ])

    // resolve the price config
    const resolvedProducts = await resolveTeamPrices({
      products: results,
      teamId,
    })

    const resolvedPrices = resolvedProducts.map(
      ({ lineItems, ...product }) => ({
        ...product,
        lastOrder: lineItems[0],
      })
    )

    return c.json(
      {
        success: true,
        data: resolvedPrices,
        pagination: {
          page: page,
          limit: limit,
          total: total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
      200
    )
  })
  .get("/categories", async (c) => {
    const organizationId = c.get("organizationId")

    const { page = 1, limit = 24, q } = c.req.query()

    const { rows } = await db.execute(sql`
            SELECT DISTINCT label
            FROM (
              SELECT jsonb_array_elements_text(categories) AS label
              FROM ${product}
              WHERE
                categories IS NOT NULL
                AND ${product.organizationId} = ${organizationId}
            ) AS c
            ${q ? sql`WHERE label ILIKE ${`%${q}%`}` : sql``}
            ORDER BY label ASC
          `)

    const categories = rows.map((row) => row.label as string)

    return c.json(
      {
        success: true,
        data: categories,
        pagination: {
          page,
          limit,
          total: categories.length,
          totalPages: Math.ceil(categories.length / Number(limit)),
        },
      },
      200
    )
  })
