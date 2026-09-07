import { Hono } from "hono"

import { db, session, teamMember } from "@jp/db"
import { eq, inArray, max } from "drizzle-orm"
import { TeamAppContext, teamPermission } from "@/lib/hono/middlewares"

const app = new Hono<TeamAppContext>()

export const members = app
  .get("/", teamPermission({ member: ["read"] }), async (c) => {
    const currentSession = c.get("session")
    const teamId = currentSession?.activeTeamId!

    const teamMembers = await db.query.teamMember.findMany({
      where: (tm, { eq }) => eq(tm.teamId, teamId),
      with: {
        user: true,
      },
    })

    const memberIds = teamMembers.map((m) => m.userId)
    const lastSessionByUser = new Map<string, Date | null>()

    const latestSession = await db
      .select({
        userId: session.userId,
        lastSession: max(session.createdAt).as("lastSession"),
      })
      .from(session)
      .where(inArray(session.userId, memberIds))
      .groupBy(session.userId)

    for (const row of latestSession) {
      lastSessionByUser.set(row.userId, row.lastSession)
    }

    const transformed = teamMembers.map((member) => {
      return {
        ...member,
        lastActive: lastSessionByUser.get(member.userId),
      }
    })

    return c.json({ success: true, data: transformed }, 200)
  })
  .get("/count", teamPermission({ member: ["read"] }), async (c) => {
    const currentSession = c.get("session")
    const teamId = currentSession?.activeTeamId!

    const total = await db.$count(teamMember, eq(teamMember.teamId, teamId))

    return c.json({ data: { all: total }, success: true }, 200)
  })
