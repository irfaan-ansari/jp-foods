import { Hono } from "hono"

import { db, product } from "@jp/db"

import {
  and,
  arrayContains,
  asc,
  count,
  desc,
  eq,
  ilike,
  sql,
} from "drizzle-orm"
import { OrgAppContext, orgPermission } from "@/lib/hono/middlewares"
import { AppError } from "@jp/utils"
import { parsePagination, getStatusCounts } from "@/lib/hono/lib"

const app = new Hono<OrgAppContext>()

app.use("/", orgPermission({ product: ["read"] }))

/** get products */
export const productRoute = app
  .get("/", async (c) => {
    const organizationId = c.get("organizationId")

    const { q, status, cat, ...rest } = c.req.query()
    const { page, limit, offset } = parsePagination(rest)

    const filters = and(
      eq(product.organizationId, organizationId),
      status ? eq(product.status, status) : undefined,
      cat ? arrayContains(product.categories, [cat]) : undefined,
      q ? ilike(product.searchText, `%${q}%`) : undefined
    )

    const response = await db.query.product.findMany({
      where: filters,
      with: { sellUnits: true },
      limit,
      offset,
      orderBy: [desc(product.createdAt), asc(product.id)],
    })

    const total = await db.$count(product, filters)

    return c.json({
      success: true,
      data: response,
      pagination: {
        page: page,
        limit,
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    })
  })
  /** get counts */
  .get("/count", async (c) => {
    const organizationId = c.get("organizationId")!

    const result = await db
      .select({
        status: product.status,
        value: count(),
      })
      .from(product)
      .where(eq(product.organizationId, organizationId))
      .groupBy(product.status)

    const counts = getStatusCounts(result)

    return c.json({
      success: true,
      data: counts,
    })
  })
  .get("/units", async (c) => {
    const organizationId = c.get("organizationId")

    const { q, status, cat, ...rest } = c.req.query()
    const { page, limit, offset } = parsePagination(rest)

    const filters = and(
      eq(product.organizationId, organizationId),
      status ? eq(product.status, status) : undefined,
      cat ? arrayContains(product.categories, [cat]) : undefined,
      q ? ilike(product.searchText, `%${q}%`) : undefined
    )

    const response = await db.query.product.findMany({
      where: filters,
      with: { sellUnits: true },
      limit,
      offset,
      orderBy: [desc(product.createdAt), asc(product.id)],
    })

    const total = await db.$count(product, filters)

    return c.json({
      success: true,
      data: response,
      pagination: {
        page: page,
        limit,
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    })
  })
  /** get product categories */
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

    return c.json({
      success: true,
      data: categories,
      pagination: {
        page,
        limit,
        total: categories.length,
        totalPages: Math.ceil(categories.length / Number(limit)),
      },
    })
  })
  /** get product by id */
  .get("/:id", async (c) => {
    const id = c.req.param("id")
    const organizationId = c.get("organizationId")

    const response = await db.query.product.findFirst({
      where: (p, { and, eq }) =>
        and(eq(p.id, Number(id)), eq(p.organizationId, organizationId)),
      with: {
        sellUnits: true,
      },
    })

    if (!response) throw new AppError("NOT_FOUND")

    return c.json({
      success: true,
      data: response,
    })
  })
