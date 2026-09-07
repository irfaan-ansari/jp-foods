import { db, team } from "@jp/db"
import { getStatusCounts } from "@/lib/hono/lib/counts"
import { parsePagination } from "@/lib/hono/lib/parse-pagination"
import { OrgAppContext, orgPermission } from "@/lib/hono/middlewares"

import { Hono } from "hono"
import { and, count, eq } from "drizzle-orm"

const app = new Hono<OrgAppContext>()

app.use("*", orgPermission({ team: ["read"] }))

export const teamRoutes = app
  .get("/", async (c) => {
    const organizationId = c.get("organizationId")

    const { q, status, ...rest } = c.req.query()

    const { page, limit, offset } = parsePagination(rest)

    const [results, total] = await Promise.all([
      db.query.team.findMany({
        where: (t, { and, eq, or }) =>
          and(
            eq(t.organizationId, organizationId),
            status ? eq(t.status, status) : undefined
          ),
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
      db.$count(
        team,
        and(
          eq(team.organizationId, organizationId),
          status ? eq(team.status, status) : undefined
        )
      ),
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

    return c.json({
      success: true,
      data: counts,
    })
  })
