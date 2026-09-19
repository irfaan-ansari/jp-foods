import { Hono } from "hono"

import { db, order } from "@jp/db"
import { and, count, eq } from "drizzle-orm"
import { AppError, pluralize } from "@jp/utils"
import { TeamAppContext } from "@/lib/hono/middlewares"
import { parsePagination, getStatusCounts } from "@/lib/hono/lib"
import { renderToStream } from "@react-pdf/renderer"
import { OrderInvoice } from "@jp/pdf"

const orderApp = new Hono<TeamAppContext>()
  .get("/", async (c) => {
    const teamId = c.get("teamId")
    const organnizationId = c.get("organizationId")

    const { q, status, ...rest } = c.req.query()
    const { page, limit, offset } = parsePagination(rest)

    const conditions = [
      eq(order.teamId, teamId),
      eq(order.organizationId, organnizationId),
    ]

    if (status) conditions.push(eq(order.status, status))

    const [orders, total] = await Promise.all([
      db.query.order.findMany({
        where: and(...conditions),
        with: {
          lineItems: {
            columns: { id: true },
          },
        },
        limit,
        offset,
        orderBy: (order, { desc }) => [desc(order.id), desc(order.createdAt)],
      }),
      db.$count(order, and(...conditions)),
    ])

    const transformedOrders = orders.map((o) => ({
      ...o,
      lineItemsCount: o.lineItems.length,
    }))

    return c.json({
      success: true,
      data: transformedOrders,
      pagination: {
        page: page,
        limit: limit,
        total: total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    })
  })
  .get("/count", async (c) => {
    const teamId = c.get("teamId")
    const organizationId = c.get("organizationId")

    const result = await db
      .select({
        status: order.status,
        value: count(),
      })
      .from(order)
      .where(
        and(eq(order.teamId, teamId), eq(order.organizationId, organizationId))
      )
      .groupBy(order.status)

    const counts = getStatusCounts(result)

    return c.json({
      success: true,
      data: counts,
    })
  })
  .get("/dashboard", async (c) => {
    const teamId = c.get("teamId")
    const organizationId = c.get("organizationId")
    const orders = await db.query.order.findMany({
      where: (currentOrder, { and, eq }) =>
        and(
          eq(currentOrder.teamId, teamId),
          eq(currentOrder.organizationId, organizationId)
        ),
      columns: {
        id: true,
        status: true,
        total: true,
        lineItemCount: true,
        deliveryDate: true,
        createdAt: true,
      },
      orderBy: (currentOrder, { desc }) => [desc(currentOrder.createdAt)],
    })

    const now = new Date()
    const monthKeys = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1)
      return {
        key: `${date.getFullYear()}-${date.getMonth()}`,
        label: date.toLocaleDateString("en-US", { month: "short" }),
      }
    })
    const spendByMonth = new Map(monthKeys.map(({ key }) => [key, 0]))
    const currentMonthKey = `${now.getFullYear()}-${now.getMonth()}`

    let monthOrderCount = 0
    let monthSpend = 0
    let openOrderCount = 0

    for (const currentOrder of orders) {
      const createdAt = currentOrder.createdAt
      const total = Number(currentOrder.total) || 0
      const key = createdAt
        ? `${createdAt.getFullYear()}-${createdAt.getMonth()}`
        : ""

      if (key === currentMonthKey) {
        monthOrderCount += 1
        monthSpend += total
      }
      if (!["completed", "cancelled"].includes(currentOrder.status)) {
        openOrderCount += 1
      }
      if (spendByMonth.has(key)) {
        spendByMonth.set(key, (spendByMonth.get(key) ?? 0) + total)
      }
    }

    return c.json({
      success: true,
      data: {
        stats: {
          openOrderCount,
          monthOrderCount,
          monthSpend,
          totalOrderCount: orders.length,
        },
        spend: monthKeys.map(({ key, label }) => ({
          month: label,
          total: spendByMonth.get(key) ?? 0,
        })),
        recentOrders: orders.slice(0, 5),
      },
    })
  })
  .get("/:id", async (c) => {
    const { id } = c.req.param()
    const teamId = c.get("teamId")
    const organizationId = c.get("organizationId")

    const result = await db.query.order.findFirst({
      where: (o, { and, eq }) =>
        and(
          eq(o.id, Number(id)),
          eq(o.teamId, teamId),
          eq(o.organizationId, organizationId)
        ),
      with: {
        lineItems: { with: { product: true } },
      },
    })

    if (!result) throw new AppError("NOT_FOUND")

    const lineItems = result.lineItems.map((item) => ({
      ...item,
      unitName: item.unitName
        ? pluralize(Number(item.quantity), item.unitName)
        : "",
    }))

    const data = {
      ...result,
      lineItems,
      estimateUrl:
        process.env.BETTER_AUTH_URL + `/api/v1/team/orders/${id}/estimate`,
    }

    return c.json({
      success: true,
      data,
    })
  })
  .get("/:id/estimate", async (c) => {
    const id = c.req.param("id")
    const teamId = c.get("teamId")
    const organizationId = c.get("organizationId")
    const data = await db.query.order.findFirst({
      where: (o, { and, eq }) =>
        and(
          eq(o.id, Number(id)),
          eq(o.teamId, teamId),
          eq(o.organizationId, organizationId)
        ),
      with: {
        lineItems: true,
        organization: true,
        team: true,
      },
    })
    if (!data) throw new AppError("NOT_FOUND")

    const lineItems = data.lineItems.map((item) => ({
      ...item,
      unitName: item.unitName
        ? pluralize(Number(item.quantity), item.unitName)
        : "",
    }))

    const stream = await renderToStream(
      OrderInvoice({
        data: {
          ...data,
          organization: data.organization!,
          team: data.team!,
          lineItems,
        },
      })
    )

    // @ts-expect-error - Type assertion for Response body
    return c.body(stream, 200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="order-${id}.pdf"`,
    })
  })

export const orders: Hono<TeamAppContext> = orderApp
