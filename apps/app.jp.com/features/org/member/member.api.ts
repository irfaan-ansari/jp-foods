import { OrgAppContext, orgPermission } from "@/lib/hono/middlewares"
import { db, member, session, team, teamMember } from "@jp/db"
import { parsePagination } from "@jp/utils"
import { and, eq, inArray, max } from "drizzle-orm"
import { Hono } from "hono"

const app = new Hono<OrgAppContext>()

app.use("/", orgPermission({ member: ["read"] }))

export const memberRoutes = app
  .get("/", async (c) => {
    const organizationId = c.get("organizationId")

    const { q, status, role, ...rest } = c.req.query()
    const { page, limit, offset } = parsePagination(rest)

    const [results, total] = await Promise.all([
      db.query.member.findMany({
        where: (t, { and, eq, or }) =>
          and(
            eq(t.organizationId, organizationId),
            role ? eq(t.role, role) : undefined
          ),
        with: {
          user: true,
        },
        limit,
        offset,
        orderBy: (t, { desc }) => [desc(t.createdAt), desc(t.id)],
      }),
      db.$count(
        member,
        and(
          eq(member.organizationId, organizationId),
          role ? eq(member.role, role) : undefined
        )
      ),
    ])

    const memberIds = results.map((m) => m.userId)

    const latestSession = db
      .select({
        userId: session.userId,
        lastSession: max(session.createdAt).as("lastSession"),
      })
      .from(session)
      .groupBy(session.userId)
      .as("latestSession")

    const accountRows = await db
      .select({
        userId: teamMember.userId,
        id: team.id,
        name: team.name,
        logo: team.logo,
        lastSession: latestSession.lastSession,
      })
      .from(teamMember)
      .innerJoin(team, eq(teamMember.teamId, team.id))
      .leftJoin(latestSession, eq(teamMember.userId, latestSession.userId))
      .where(
        and(
          inArray(teamMember.userId, memberIds),
          eq(team.organizationId, organizationId)
        )
      )

    const accountsByUser = new Map<
      string,
      { name: string; logo: string; id: string }[]
    >()
    const lastSessionByUser = new Map<string, Date | null>()

    for (const row of accountRows) {
      const list = accountsByUser.get(row.userId) ?? []
      list.push({
        id: row.id,
        name: row.name,
        logo: row.logo!,
      })
      accountsByUser.set(row.userId, list)
      lastSessionByUser.set(row.userId, row.lastSession)
    }

    const transformed = results.map((member) => {
      const accounts =
        member.role === "customer"
          ? (accountsByUser.get(member.userId) ?? [])
          : []
      return {
        ...member,
        accounts,
        lastSession: lastSessionByUser.get(member.userId) ?? null,
      }
    })

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
    const organizationId = c.get("organizationId")!

    const result = await db.$count(
      member,
      eq(member.organizationId, organizationId)
    )

    return c.json({
      success: true,
      data: {
        all: result,
      },
    })
  })
