import { Hono } from "hono"

import { AppError, pluralize } from "@jp/utils"
import { db, order, team } from "@jp/db"
import { sortLineItems } from "./order.utils"
import { OrderInvoice, PackingSlip } from "@jp/pdf"
import { renderToStream } from "@react-pdf/renderer"
import { parsePagination, getStatusCounts } from "@/lib/hono/lib"
import { and, count, eq, exists, ilike, or, sql } from "drizzle-orm"
import { OrgAppContext, orgPermission } from "@/lib/hono/middlewares"

const app = new Hono<OrgAppContext>()

app.use("*", orgPermission({ order: ["read"] }))

const orderApp = app
  .get("/", async (c) => {
    const organizationId = c.get("organizationId")!

    const { q, status, customer, user, ...rest } = c.req.query()
    const { page, limit, offset } = parsePagination(rest)

    const conditions = [
      eq(order.organizationId, organizationId),
      status ? eq(order.status, status) : undefined,
      customer ? eq(order.teamId, customer) : undefined,
      user ? eq(order.userId, user) : undefined,
    ]

    const search = q?.trim()
    if (search) {
      const orderNumber = search.replace(/^#/, "")
      conditions.push(
        or(
          ilike(sql`${order.total}::text`, `%${orderNumber}%`),
          ilike(sql`${order.id}::text`, `%${orderNumber}%`)
        )
      )
    }

    const [response, total] = await Promise.all([
      db.query.order.findMany({
        where: and(...conditions),
        with: {
          lineItems: {
            columns: {
              id: true,
            },
          },
          team: {
            columns: {
              id: true,
              name: true,
              phoneNumber: true,
              email: true,
            },
          },
          user: {
            columns: {
              id: true,
              name: true,
              phoneNumber: true,
              email: true,
            },
          },
        },
        limit,
        offset,
        orderBy: (order, { desc }) => [desc(order.createdAt)],
      }),
      db.$count(order, and(...conditions)),
    ])

    const transformed = response.map(({ lineItems, ...order }) => ({
      ...order,
      lineItemCount: lineItems.length,
    }))

    return c.json({
      success: true,
      data: transformed,
      pagination: {
        page: page,
        limit: limit,
        total: total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    })
  })
  .get("/count", async (c) => {
    const organizationId = c.get("organizationId")

    const result = await db
      .select({
        status: order.status,
        value: count(),
      })
      .from(order)
      .where(eq(order.organizationId, organizationId!))
      .groupBy(order.status)

    const counts = getStatusCounts(result)

    return c.json({
      success: true,
      data: counts,
    })
  })
  .get("/:id", async (c) => {
    const id = c.req.param("id")
    const organizationId = c.get("organizationId")!

    const response = await db.query.order.findFirst({
      where: (o, { eq, and }) =>
        and(eq(o.organizationId, organizationId), eq(o.id, Number(id))),
      with: {
        lineItems: true,
        team: true,
        user: true,
      },
    })

    if (!response) throw new AppError("NOT_FOUND")

    const lineItems = sortLineItems(response.lineItems)

    const transformed = lineItems.map((item) => ({
      ...item,
      unitName: item.unit?.name ? pluralize(item.unitName, item.quantity) : "",
    }))

    return c.json({
      success: true,
      data: { ...response, lineItems: transformed },
    })
  })

  .get("/:id/slip", async (c) => {
    const id = c.req.param("id")
    const organizationId = c.get("organizationId")!

    const data = await db.query.order.findFirst({
      where: (o, { and, eq }) =>
        and(eq(o.organizationId, organizationId), eq(order.id, Number(id))),
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
      PackingSlip({
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
  .get("/:id/estimate", async (c) => {
    const id = c.req.param("id")
    const organizationId = c.get("organizationId")

    const data = await db.query.order.findFirst({
      where: (o, { and, eq }) =>
        and(eq(o.organizationId, organizationId), eq(order.id, Number(id))),
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

export const orders: Hono<OrgAppContext> = orderApp
