import { Hono } from "hono"
import { db } from "@jp/db"
import { getDashboardRankings } from "./dashboard.utils"
import { orgPermission, type OrgAppContext } from "@/lib/hono/middlewares"

const app = new Hono<OrgAppContext>()

app.use(
  "*",
  orgPermission({ order: ["read"], product: ["read"], team: ["read"] })
)

export const dashboardRoutes = app.get("/insights", async (c) => {
  const organizationId = c.get("organizationId")
  const [orders, products, customers] = await Promise.all([
    db.query.order.findMany({
      columns: { status: true, createdAt: true, teamId: true, total: true },
      with: {
        lineItems: {
          columns: {
            productId: true,
            title: true,
            itemCode: true,
            subtotal: true,
            categories: true,
          },
        },
      },
      where: (order, { eq }) => eq(order.organizationId, organizationId),
    }),
    db.query.product.findMany({
      columns: { id: true, title: true },
      where: (product, { eq }) => eq(product.organizationId, organizationId),
    }),
    db.query.team.findMany({
      columns: { id: true, name: true },
      where: (team, { eq }) => eq(team.organizationId, organizationId),
    }),
  ])

  const now = new Date()
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5 + index, 1)
    )
    return {
      key: date.toISOString().slice(0, 7),
      month: date.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
        timeZone: "UTC",
      }),
      orders: 0,
    }
  })
  for (const order of orders) {
    const month = months.find(
      (month) => month.key === order.createdAt?.toISOString().slice(0, 7)
    )
    if (month) month.orders++
  }

  return c.json({
    success: true,
    data: {
      ...getDashboardRankings(orders, products, customers),
      overview: months.map(({ month, orders }) => ({ month, orders })),
    },
  })
})
