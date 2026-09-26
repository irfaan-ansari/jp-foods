import { Hono } from "hono"
import { and, count, eq, ilike, inArray, or, SQL } from "drizzle-orm"

import { db, product, promotion, promotionTarget } from "@jp/db"
import { parsePagination, getStatusCounts } from "@/lib/hono/lib"
import { OrgAppContext, orgPermission } from "@/lib/hono/middlewares"

const app = new Hono<OrgAppContext>()

app.use("*", orgPermission({ promotion: ["read"] }))

const mapProduct = (item: typeof product.$inferSelect) => ({
  ...item,
  id: item.id,
  title: item.title,
  image: item.image ?? "",
  itemCode: item.itemCode,
})

const transformPromotions = async (
  response: (typeof promotion.$inferSelect)[],
  organizationId: string
) => {
  const promotionIds = response.map((p) => p.id)
  const targets =
    promotionIds.length > 0
      ? await db.query.promotionTarget.findMany({
          where: inArray(promotionTarget.promotionId, promotionIds),
          with: {
            team: {
              columns: {
                id: true,
                name: true,
                phoneNumber: true,
                email: true,
              },
            },
          },
        })
      : []

  const targetsByPromotionId = new Map<number, typeof targets>()
  for (const target of targets) {
    const existing = targetsByPromotionId.get(target.promotionId) ?? []
    existing.push(target)
    targetsByPromotionId.set(target.promotionId, existing)
  }

  const productIds = [
    ...new Set(
      response.flatMap((p) => [
        ...(p.productIds ?? []),
        ...(p.triggerProductIds ?? []),
      ])
    ),
  ]

  const products =
    productIds.length > 0
      ? await db.query.product.findMany({
          where: and(
            eq(product.organizationId, organizationId),
            inArray(product.id, productIds)
          ),
        })
      : []

  const productMap = new Map(products.map((item) => [item.id, item]))

  return response.map(
    ({ productIds, triggerProductIds, placement, ...item }) => ({
      ...item,
      placement: placement?.[0] ?? "sidebar",
      teams: (targetsByPromotionId.get(item.id) ?? [])
        .map(({ team }) =>
          team
            ? {
                id: team.id,
                name: team.name,
                phoneNumber: team.phoneNumber,
                email: team.email,
              }
            : null
        )
        .filter(
          (
            value
          ): value is {
            id: string
            name: string
            phoneNumber: string
            email: string
          } => Boolean(value)
        ),
      products: (productIds ?? [])
        .map((id) => productMap.get(id))
        .filter((item): item is typeof product.$inferSelect => Boolean(item))
        .map(mapProduct),
      triggerProducts: (triggerProductIds ?? [])
        .map((id) => productMap.get(id))
        .filter((item): item is typeof product.$inferSelect => Boolean(item))
        .map(mapProduct),
    })
  )
}

export const promotionRoutes = app
  .get("/", async (c) => {
    const organizationId = c.get("organizationId")
    const { q, status, ...rest } = c.req.query()
    const { page, limit, offset } = parsePagination(rest)

    const conditions = [eq(promotion.organizationId, organizationId)]

    if (status) conditions.push(eq(promotion.status, status))
    if (q) {
      conditions.push(
        or(
          ilike(promotion.name, `%${q}%`),
          ilike(promotion.media, `%${q}%`)
        ) as SQL<unknown>
      )
    }

    const filters = and(...conditions)

    const [response, total] = await Promise.all([
      db.query.promotion.findMany({
        where: filters,
        limit,
        offset,
        orderBy: (p, { desc }) => [desc(p.createdAt)],
      }),
      db.$count(promotion, filters),
    ])

    const transformed = await transformPromotions(response, organizationId)

    return c.json({
      success: true,
      data: transformed,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    })
  })
  .get("/:id", async (c) => {
    const organizationId = c.get("organizationId")
    const id = Number(c.req.param("id"))

    const response = await db.query.promotion.findFirst({
      where: (p, { and, eq }) =>
        and(eq(p.organizationId, organizationId), eq(p.id, id)),
    })

    if (!response) {
      return c.json(
        {
          success: false,
          error: {
            message: "Promotion not found",
          },
        },
        404
      )
    }

    const [data] = await transformPromotions([response], organizationId)

    return c.json({
      success: true,
      data,
    })
  })
  .get("/count", async (c) => {
    const organizationId = c.get("organizationId")!

    const result = await db
      .select({
        status: promotion.status,
        value: count(),
      })
      .from(promotion)
      .where(eq(promotion.organizationId, organizationId))
      .groupBy(promotion.status)

    return c.json({
      success: true,
      data: getStatusCounts(result),
    })
  })
