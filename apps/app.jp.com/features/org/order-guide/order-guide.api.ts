import { Hono } from "hono"
import { eq } from "drizzle-orm"
import { db, orderGuide } from "@jp/db"
import { parsePagination, getStatusCounts } from "@/lib/hono/lib"
import { OrgAppContext, orgPermission } from "@/lib/hono/middlewares"

const app = new Hono<OrgAppContext>()

app.use("*", orgPermission({ orderGuide: ["read"] }))
export const orderGuideRoutes = app
  .get("/", async (c) => {
    const organizationId = c.get("organizationId")

    const { q, ...rest } = c.req.query()
    const { page, limit, offset } = parsePagination(rest)

    const [response, total] = await Promise.all([
      db.query.orderGuide.findMany({
        where: (og, { and, eq }) => and(eq(og.organizationId, organizationId)),
        with: {
          orderGuideItems: {
            with: { product: true },
          },
          team: {
            columns: {
              id: true,
              name: true,
              logo: true,
            },
          },
        },
        limit,
        offset,
        orderBy: (og, { desc, asc }) => [desc(og.createdAt), asc(og.position)],
      }),
      db.$count(orderGuide, eq(orderGuide.organizationId, organizationId)),
    ])

    const transformed = response.map((og) => {
      const { orderGuideItems, team, ...rest } = og

      const products = orderGuideItems.map((ogi) => {
        const { product, position } = ogi
        const { id, title, itemCode, image, price, uom } = product
        return { id, title, itemCode, image, price, uom, unit: uom, position }
      })
      return {
        ...rest,
        products,
        team,
      }
    })

    return c.json({
      success: true,
      data: transformed,
      pagination: {
        page: page,
        limit,
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    })
  })
  .get("/count", async (c) => {
    const organizationId = c.get("organizationId")!

    const result = await db.$count(
      orderGuide,
      eq(orderGuide.organizationId, organizationId)
    )

    return c.json({
      success: true,
      data: {
        all: result,
      },
    })
  })
