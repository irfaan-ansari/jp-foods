import { Hono } from "hono"

import { db, promotionTarget } from "@jp/db"

import { TeamAppContext } from "@/lib/hono/middlewares"
import { resolveTeamPrices } from "@/features/org/price-level/price-level-resolver"

const app = new Hono<TeamAppContext>()

export const promotions = app.get("/", async (c) => {
  const teamId = c.get("teamId")
  const organizationId = c.get("organizationId")

  const promotions = await db.query.promotion.findMany({
    where: (p, { eq, and, or, exists }) =>
      and(
        eq(p.status, "active"),
        eq(p.organizationId, organizationId),
        or(
          eq(p.target, "all"),
          exists(
            db
              .select()
              .from(promotionTarget)
              .where(
                and(
                  eq(promotionTarget.promotionId, p.id),
                  eq(promotionTarget.teamId, teamId)
                )
              )
          )
        )
      ),
    orderBy: (order, { desc }) => [desc(order.createdAt)],
  })

  const productIds = [...new Set(promotions.flatMap((p) => p.productIds ?? []))]
  const products = await db.query.product.findMany({
    where: (product, { inArray }) => inArray(product.id, productIds),
    with: {
      sellUnits: true,
    },
  })

  const resolvedProducts = await resolveTeamPrices({
    products,
    teamId,
  })

  const productsMap = new Map(
    resolvedProducts.map((product) => [product.id, product])
  )

  const response = promotions.map(({ productIds, ...promotion }) => ({
    ...promotion,
    products: (productIds ?? [])
      .map((id) => productsMap.get(id))
      .filter(Boolean),
  }))

  return c.json(
    {
      success: true,
      data: response,
    },
    200
  )
})
