import { Hono } from "hono"
import { and, count, eq, ilike, or, SQL } from "drizzle-orm"

import { db, messageCampaign, messageRecipient } from "@jp/db"
import { parsePagination, getStatusCounts } from "@/lib/hono/lib"
import { OrgAppContext, orgPermission } from "@/lib/hono/middlewares"
import { AppError } from "@jp/utils"

const app = new Hono<OrgAppContext>()

app.use("*", orgPermission({ messaging: ["read"] }))

export const messagingRoutes = app
  .get("/", async (c) => {
    const organizationId = c.get("organizationId")
    const { q, status, ...rest } = c.req.query()
    const { page, limit, offset } = parsePagination(rest)

    const conditions = [
      eq(messageCampaign.organizationId, organizationId),
      status ? eq(messageCampaign.status, status) : undefined,
    ]

    if (q) {
      conditions.push(
        or(
          ilike(messageCampaign.name, `%${q}%`),
          ilike(messageCampaign.message, `%${q}%`)
        ) as SQL<unknown>
      )
    }

    const filters = and(...conditions)

    const [data, total] = await Promise.all([
      db.query.messageCampaign.findMany({
        where: filters,
        with: {
          creator: {
            columns: { id: true, name: true },
          },
        },
        limit,
        offset,
        orderBy: (campaign, { desc }) => [desc(campaign.createdAt)],
      }),
      db.$count(messageCampaign, filters),
    ])

    return c.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    })
  })
  .get("/count", async (c) => {
    const organizationId = c.get("organizationId")
    const result = await db
      .select({
        status: messageCampaign.status,
        value: count(),
      })
      .from(messageCampaign)
      .where(eq(messageCampaign.organizationId, organizationId))
      .groupBy(messageCampaign.status)

    return c.json({ success: true, data: getStatusCounts(result) })
  })
  .get("/:id", async (c) => {
    const organizationId = c.get("organizationId")
    const id = Number(c.req.param("id"))

    const data = await db.query.messageCampaign.findFirst({
      where: (campaign, { and, eq }) =>
        and(eq(campaign.organizationId, organizationId), eq(campaign.id, id)),
      with: {
        creator: {
          columns: { id: true, name: true },
        },
      },
    })

    if (!data) throw new AppError("NOT_FOUND")
    return c.json({ success: true, data })
  })
  .get("/:id/recipients", async (c) => {
    const organizationId = c.get("organizationId")
    const campaignId = Number(c.req.param("id"))
    const { status, ...rest } = c.req.query()
    const { page, limit, offset } = parsePagination(rest)

    const filters = and(
      eq(messageRecipient.organizationId, organizationId),
      eq(messageRecipient.campaignId, campaignId),
      status ? eq(messageRecipient.status, status) : undefined
    )

    const [data, total] = await Promise.all([
      db.query.messageRecipient.findMany({
        where: filters,
        limit,
        offset,
        orderBy: (recipient, { desc }) => [desc(recipient.createdAt)],
      }),
      db.$count(messageRecipient, filters),
    ])

    return c.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    })
  })
