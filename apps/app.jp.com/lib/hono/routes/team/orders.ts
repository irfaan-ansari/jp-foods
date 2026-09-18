import { Hono } from "hono"

import { db, order } from "@jp/db"
import { and, count, eq } from "drizzle-orm"
import { AppError } from "@jp/utils"
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

    const result = await db
      .select({
        status: order.status,
        value: count(),
      })
      .from(order)
      .where(eq(order.teamId, teamId))
      .groupBy(order.status)

    const counts = getStatusCounts(result)

    return c.json({
      success: true,
      data: counts,
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

    const data = {
      ...result,
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

    // @ts-expect-error - Type assertion for PDF props
    const pdf = await renderToStream(OrderInvoice({ data }))

    // @ts-expect-error - Type assertion for Response body
    return c.body(pdf, 200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="order-${id}.pdf"`,
    })
  })

export const orders: Hono<TeamAppContext> = orderApp
