import { Hono } from "hono"

import { db } from "@jp/db"

import { TeamAppContext, teamPermission } from "@/lib/hono/middlewares"

const app = new Hono<TeamAppContext>()

// list teams
export const teams = app
  .get("/list", async (c) => {
    const userId = c.get("user")?.id
    console.log("userId::", userId)
    const response = await db.query.teamMember.findMany({
      where: (tm, { eq }) => eq(tm.userId, userId!),
      with: { team: true },
    })

    return c.json(
      {
        success: true,
        data: response.map((r) => r.team),
      },
      200
    )
  })

  // active team
  .get("/active", teamPermission({ team: ["read"] }), async (c) => {
    const session = c.get("session")
    const teamId = session?.activeTeamId

    if (!teamId) return c.json({ success: true, data: null }, 200)

    const response = await db.query.team.findFirst({
      where: (team, { eq }) => eq(team.id, teamId!),
    })

    const tax = await db.query.taxRule.findFirst({
      where: (tr, { eq }) => eq(tr.id, response?.taxRuleId!),
    })

    return c.json({ success: true, data: { ...response, taxRule: tax } }, 200)
  })
