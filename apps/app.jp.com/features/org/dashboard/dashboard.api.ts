import { Hono } from "hono"
import { db, lineItem, order, team } from "@jp/db"
import { orgPermission, type OrgAppContext } from "@/lib/hono/middlewares"
import { format, startOfMonth, subMonths } from "@jp/utils/date"
import {
  and,
  countDistinct,
  desc,
  eq,
  gte,
  isNotNull,
  ne,
  sql,
} from "@jp/db/query"
import type { DashboardRanking } from "./dashboard.type"

const app = new Hono<OrgAppContext>()

app.use(
  "*",
  orgPermission({ order: ["read"], product: ["read"], team: ["read"] })
)

export const dashboardRoutes = app.get("/insights", async (c) => {
  const organizationId = c.get("organizationId")

  const now = new Date()
  const rangeStart = startOfMonth(subMonths(now, 5))
  const orderWhere = and(
    eq(order.organizationId, organizationId),
    gte(order.createdAt, rangeStart)
  )
  const activeOrderWhere = and(orderWhere, ne(order.status, "cancelled"))

  const [orders, topProducts, topCustomers, frequentlyOrdered, topCategories] =
    await Promise.all([
      db.query.order.findMany({
        columns: { createdAt: true, total: true },
        where: orderWhere,
      }),
      db
        .select({
          id: sql<string>`'product:' || ${lineItem.productId}::text`,
          name: lineItem.title,
          productId: lineItem.productId,
          value: sql<number>`
          coalesce(sum(${lineItem.total}::numeric), 0)::float
        `,
        })
        .from(lineItem)
        .innerJoin(order, eq(lineItem.orderId, order.id))
        .where(and(activeOrderWhere, isNotNull(lineItem.productId)))
        .groupBy(lineItem.productId, lineItem.title)
        .orderBy(desc(sql`sum(${lineItem.total}::numeric)`))
        .limit(5),
      db
        .select({
          id: order.teamId,
          name: sql<string>`coalesce(${team.name}, 'Deleted customer')`,
          value: sql<number>`
          coalesce(sum(${order.total}::numeric), 0)::float
        `,
        })
        .from(order)
        .leftJoin(team, eq(order.teamId, team.id))
        .where(and(activeOrderWhere, isNotNull(order.teamId)))
        .groupBy(order.teamId, team.name)
        .orderBy(desc(sql`sum(${order.total}::numeric)`))
        .limit(12),
      db
        .select({
          id: sql<string>`'product:' || ${lineItem.productId}::text`,
          name: lineItem.title,
          productId: lineItem.productId,
          value: countDistinct(order.id),
        })
        .from(lineItem)
        .innerJoin(order, eq(lineItem.orderId, order.id))
        .where(and(activeOrderWhere, isNotNull(lineItem.productId)))
        .groupBy(lineItem.productId, lineItem.title)
        .orderBy(desc(countDistinct(order.id)))
        .limit(5),
      db.execute<{
        id: string
        name: string
        value: number
      }>(sql`
      select
        category.value as id,
        category.value as name,
        count(distinct ${order.id})::int as value
      from ${lineItem}
      inner join ${order}
        on ${lineItem.orderId} = ${order.id}
      cross join lateral
        jsonb_array_elements_text(${lineItem.categories}) as category(value)
      where
        ${order.organizationId} = ${organizationId}
        and ${order.createdAt} >= ${rangeStart}
        and ${order.status} <> 'cancelled'
        and ${lineItem.productId} is not null
        and trim(category.value) <> ''
      group by category.value
      order by value desc, category.value asc
      limit 5
    `),
    ])

  const months = Array.from({ length: 6 }, (_, index) => {
    const date = subMonths(now, 5 - index)
    return {
      key: format(date, "yyyy-MM"),
      month: format(date, "MMM yy"),
      total: 0,
    }
  })

  for (const order of orders) {
    const month = months.find((month) =>
      order.createdAt ? month.key === format(order.createdAt, "yyyy-MM") : false
    )
    if (month) {
      const total = Number(order.total)
      month.total += Number.isFinite(total) ? total : 0
    }
  }

  return c.json({
    success: true,
    data: {
      topProducts: topProducts.map((row) => ({
        id: row.id,
        name: row.name ?? "Untitled product",
        value: row.value,
        href: row.productId ? `/org/products/${row.productId}` : undefined,
      })),
      topCustomers: topCustomers.map((row) => ({
        id: row.id!,
        name: row.name,
        value: row.value,
        href:
          row.name === "Deleted customer"
            ? undefined
            : `/org/customers/${row.id}`,
      })),
      frequentlyOrdered: frequentlyOrdered.map((row) => ({
        id: row.id,
        name: row.name ?? "Untitled product",
        value: row.value,
        href: row.productId ? `/org/products/${row.productId}` : undefined,
      })),
      topCategories: topCategories.rows.map((row) => ({
        id: row.id,
        name: row.name,
        value: row.value,
        href: `/org/products?cat=${encodeURIComponent(row.name)}`,
      })) satisfies DashboardRanking[],
      overview: months.map(({ month, total }) => ({ month, total })),
    },
  })
})
