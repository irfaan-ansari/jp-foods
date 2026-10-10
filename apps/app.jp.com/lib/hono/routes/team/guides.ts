import { Hono } from "hono"

import { db, orderGuide } from "@jp/db"
import { eq } from "@jp/db/query"
import { TeamAppContext } from "@/lib/hono/middlewares"
import { parsePagination } from "@/lib/hono/lib"
import { getTeamPriceResolver } from "@/features/org/price-level/price-level-resolver"
import { withCalculatedPrices } from "@jp/utils/commerce"

const app = new Hono<TeamAppContext>()

export const guides = app.get("/", async (c) => {
  const teamId = c.get("teamId")
  const { q, status, ...rest } = c.req.query()
  const { page, limit, offset } = parsePagination(rest)

  const [results, total, privateProducts] = await Promise.all([
    db.query.orderGuide.findMany({
      where: (og, { eq }) => eq(og.teamId, teamId),
      with: {
        orderGuideItems: {
          with: {
            product: {
              with: {
                lineItems: {
                  columns: {
                    id: true,
                    orderId: true,
                    quantity: true,
                    unit: true,
                    createdAt: true,
                  },
                  limit: 1,
                  where: (lineItem, { eq }) => eq(lineItem.teamId, teamId),
                  orderBy: (li, { desc }) => [desc(li.createdAt)],
                },
              },
            },
          },
          orderBy: (ogi, { desc }) => [desc(ogi.position)],
        },
      },
      limit,
      offset,
      orderBy: (og, { desc, asc }) => [asc(og.position), desc(og.createdAt)],
    }),
    db.$count(orderGuide, eq(orderGuide.teamId, teamId)),
    db.query.teamProduct.findMany({
      where: (tp, { eq }) => eq(tp.teamId, teamId),
      columns: {
        productId: true,
      },
    }),
  ])

  const privateProductIds = new Set(
    privateProducts.map((item) => item.productId)
  )
  const isOrderableProduct = (product: { id: number; status: string | null }) =>
    !["archived", "draft"].includes(product.status ?? "") &&
    (product.status === "active" || privateProductIds.has(product.id))

  // resolve the price config
  const resolvePrice = await getTeamPriceResolver(teamId)
  const resolvedPrices = results.map(({ orderGuideItems, ...orderGuide }) => ({
    ...orderGuide,
    items: orderGuideItems
      .filter(({ product }) => isOrderableProduct(product))
      .map(({ id: itemId, product }) => {
        const { lineItems } = product
        const pricedProduct = resolvePrice(product)
        return {
          ...pricedProduct,
          sellUnits: withCalculatedPrices({
            ...pricedProduct,
            splitUnits: pricedProduct.splitUnits ?? [],
          }),
          itemId,
          lastOrder: lineItems?.[0],
        }
      }),
  }))

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
