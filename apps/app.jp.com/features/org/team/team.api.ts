import { db, lineItem, order, orderGuide, orderGuideItem, team } from "@jp/db"
import { parsePagination, getStatusCounts } from "@/lib/hono/lib"
import { OrgAppContext, orgPermission } from "@/lib/hono/middlewares"

import { Hono } from "hono"
import { and, count, eq, gte, sql, desc, ilike, or } from "drizzle-orm"
import { AppError } from "@jp/utils"
import { RANGE_DAYS } from "./team.const"

const app = new Hono<OrgAppContext>()

app.use("*", orgPermission({ team: ["read"] }))

export const teamRoutes = app
  .get("/", async (c) => {
    const organizationId = c.get("organizationId")

    const { q, status, ...rest } = c.req.query()

    const { page, limit, offset } = parsePagination(rest)

    const conditions = [
      eq(team.organizationId, organizationId),
      status ? eq(team.status, status) : undefined,
    ]
    if (q) {
      conditions.push(
        or(
          ilike(team.name, `%${q}%`),
          ilike(team.managerName, `%${q}%`),
          ilike(team.email, `%${q}%`),
          ilike(team.phoneNumber, `%${q}%`)
        )
      )
    }

    const [results, total] = await Promise.all([
      db.query.team.findMany({
        where: and(...conditions),
        with: {
          salesRep: {
            columns: {
              id: true,
              name: true,
            },
          },
          teamMembers: {
            with: {
              user: {
                columns: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
        limit,
        offset,
        orderBy: (t, { desc }) => [desc(t.createdAt), desc(t.id)],
      }),
      db.$count(team, and(...conditions)),
    ])

    const teamWithMembers = results.map((t) => {
      const { teamMembers, ...rest } = t

      const members = teamMembers.map((m) => {
        return {
          id: m.id,
          userId: m.userId,
          name: m.user.name,
          image: m.user.image,
        }
      })
      return {
        ...rest,
        teamMembers: members,
      }
    })

    return c.json({
      success: true,
      data: teamWithMembers,
      pagination: {
        page: page,
        limit: limit,
        total: total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    })
  })
  .get("/count", async (c) => {
    const organizationId = c.get("organizationId")!

    const result = await db
      .select({
        status: team.status,
        value: count(),
      })
      .from(team)
      .where(eq(team.organizationId, organizationId))
      .groupBy(team.status)

    const counts = getStatusCounts(result)
    console.log(counts)

    return c.json({
      success: true,
      data: counts,
    })
  })
  .get("/:id", async (c) => {
    const id = c.req.param("id")
    const organizationId = c.get("organizationId")

    const result = await db.query.team.findFirst({
      where: (t, { and, eq }) =>
        and(eq(t.organizationId, organizationId), eq(t.id, id)),
      with: {
        salesRep: {
          columns: {
            id: true,
            name: true,
          },
        },
        taxRule: {
          columns: {
            id: true,
            name: true,
            rate: true,
          },
        },
        teamMembers: {
          with: {
            user: {
              columns: {
                id: true,
                name: true,
                image: true,
                email: true,
                phoneNumber: true,
              },
            },
          },
        },
        priceLevel: {
          with: {
            priceLevelItem: {
              columns: {
                id: true,
              },
            },
          },
        },
        products: {
          columns: {
            id: true,
          },
          with: {
            product: {
              columns: {
                id: true,
                title: true,
                image: true,
                itemCode: true,
              },
            },
          },
        },
      },
    })

    if (!result) throw new AppError("NOT_FOUND")

    const teamWithMembers = {
      ...result,
      priceLevel: {
        ...result.priceLevel,
        productCount: result.priceLevel?.priceLevelItem?.length,
      },
      products: result.products.map(({ product }) => product),
      teamMembers: result.teamMembers.map((m) => {
        return {
          id: m.id,
          userId: m.userId,
          name: m.user.name,
          email: m.user.email,
          phoneNumber: m.user.phoneNumber,
          image: m.user.image,
        }
      }),
    }

    return c.json({
      success: true,
      data: teamWithMembers,
    })
  })
  .get("/:id/analytics", async (c) => {
    const id = c.req.param("id")

    const range = c.req.query("range") ?? "all"
    let rangeStart: Date | undefined

    if (range !== "all") {
      const days = Number(RANGE_DAYS[range ?? "7d"]?.days ?? 7)

      if (days) {
        rangeStart = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      }
    }

    const orderWhere = and(
      eq(order.teamId, id),
      rangeStart ? gte(order.createdAt, rangeStart) : undefined
    )

    const [
      summary,
      topProducts,
      topCategories,
      recentOrders,
      orderGuides,
      orderGuideItemCounts,
    ] = await Promise.all([
      db
        .select({
          totalOrders: count(),
          activeOrders: sql<number>`
              count(*) filter (
                where ${order.status} = 'in_progress'
              )::int
            `,
          totalSpend: sql<number>`
              coalesce(sum(${order.total}::numeric), 0)::float
            `,
          averageOrderValue: sql<number>`
              coalesce(avg(${order.total}::numeric), 0)::float
            `,
        })
        .from(order)
        .where(orderWhere),

      // Top products
      db
        .select({
          id: lineItem.productId,
          title: lineItem.title,
          itemCode: lineItem.itemCode,
          image: lineItem.image,
          quantity: sql<number>`
            coalesce(sum(${lineItem.quantity}::numeric), 0)::float
          `,
          total: sql<number>`
            coalesce(sum(${lineItem.total}::numeric), 0)::float
          `,
        })
        .from(lineItem)
        .innerJoin(order, eq(lineItem.orderId, order.id))
        .where(orderWhere)
        .groupBy(
          lineItem.productId,
          lineItem.title,
          lineItem.itemCode,
          lineItem.image
        )
        .orderBy(desc(sql`sum(${lineItem.total}::numeric)`))
        .limit(10),

      // Top categories
      db.execute<{
        name: string
        quantity: number
        total: number
      }>(sql`
          select
            category.value as name,
            coalesce(sum(${lineItem.quantity}::numeric), 0)::float as quantity,
            coalesce(sum(${lineItem.total}::numeric), 0)::float as total
        
          from ${lineItem}
        
          inner join ${order}
            on ${lineItem.orderId} = ${order.id}
        
          cross join lateral
            jsonb_array_elements_text(${lineItem.categories}) as category(value)
        
          where
            ${order.teamId} = ${id}
            ${rangeStart ? sql`and ${order.createdAt} >= ${rangeStart}` : sql``}
        
          group by category.value
        
          order by total desc
        
          limit 10
        `),

      // Recent orders
      db.query.order.findMany({
        where: (o, { and, eq, gte }) =>
          and(
            eq(o.teamId, id),
            rangeStart ? gte(o.createdAt, rangeStart) : undefined
          ),
        columns: {
          id: true,
          status: true,
          total: true,
          createdAt: true,
        },
        orderBy: (o, { desc }) => desc(o.createdAt),
        limit: 10,
      }),

      // order guides

      db.query.orderGuide.findMany({
        where: (og, { eq }) => eq(og.teamId, id),
        with: {
          orderGuideItems: {
            with: {
              product: true,
            },
            orderBy: (ogi, { asc }) => [asc(ogi.position)],
            limit: 5,
          },
        },
        orderBy: (og, { desc, asc }) => [asc(og.position), desc(og.createdAt)],
      }),

      // total item count per order guide
      db
        .select({
          orderGuideId: orderGuideItem.orderGuideId,
          totalItems: sql<number>`count(*)::int`,
        })
        .from(orderGuideItem)
        .innerJoin(orderGuide, eq(orderGuideItem.orderGuideId, orderGuide.id))
        .where(eq(orderGuide.teamId, id))
        .groupBy(orderGuideItem.orderGuideId),
    ])

    const orderGuideCountMap = new Map(
      orderGuideItemCounts.map((item) => [item.orderGuideId, item.totalItems])
    )

    const orderGuidesWithCount = orderGuides.map(
      ({ orderGuideItems, ...guide }) => ({
        ...guide,
        products: orderGuideItems.map(({ product }) => product),
        productCount: orderGuideCountMap.get(guide.id) ?? 0,
      })
    )

    return c.json({
      success: true,
      data: {
        summary: summary[0],
        topProducts,
        topCategories: topCategories.rows,
        recentOrders,
        orderGuides: orderGuidesWithCount,
      },
    })
  })
