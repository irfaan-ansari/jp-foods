import { Hono } from "hono"

import { db, order } from "@jp/db"

import { and, count, eq, ilike } from "drizzle-orm"
import { HTTPException } from "hono/http-exception"
import { OrgAppContext, orgPermission } from "@/lib/hono/middlewares"

import { parsePagination, getStatusCounts } from "@/lib/hono/lib"
import { sortLineItems } from "./order.utils"

const app = new Hono<OrgAppContext>()

app.use("*", orgPermission({ order: ["read"] }))

export const orders = app
  .get("/", async (c) => {
    const organizationId = c.get("organizationId")!

    const { q, status, ...rest } = c.req.query()
    const { page, limit, offset } = parsePagination(rest)

    const response = await db.query.order.findMany({
      where: (o, { eq, and, ilike }) =>
        and(
          eq(o.organizationId, organizationId),
          status ? eq(o.status, status) : undefined,
          q ? ilike(o.id, `%${q}%`) : undefined
        ),
      with: {
        lineItems: true,
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
    })

    const total = await db.$count(
      order,
      and(
        eq(order.organizationId, organizationId),
        status ? eq(order.status, status) : undefined,
        q ? ilike(order.id, `%${q}%`) : undefined
      )
    )

    return c.json({
      success: true,
      data: response,
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

    if (!response)
      throw new HTTPException(400, {
        message: "Order not found",
      })

    const lineItems = sortLineItems(response.lineItems)

    return c.json({
      success: true,
      data: { ...response, lineItems },
    })
  })
  .get("/:id/slip", async (c) => {
    const id = c.req.param("id")
    const organizationId = c.get("organizationId")!

    const data = await db.query.order.findFirst({
      where: eq(order.id, Number(id)),
      with: {
        lineItems: true,
        organization: true,
        team: true,
      },
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
    if (!order)
      throw new HTTPException(404, {
        message: "Order not found",
      })

    const stream = ""
    return c.body(stream as ReadableStream, 400, {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="order-${id}.pdf"`,
    })
  })
