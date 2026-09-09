import { db } from "@jp/db"
import { PORTAL_URLS } from "./permissions"
import { APIError } from "better-auth/api"

export const getActiveAccount = async (userId: string) => {
  const user = await db.query.user.findFirst({
    where: (u, { eq }) => eq(u.id, userId),
    columns: {
      role: true,
    },
  })

  if (!user) {
    throw new APIError("UNAUTHORIZED", {
      message: "Account not found",
    })
  }

  const portal = PORTAL_URLS[user.role as keyof typeof PORTAL_URLS]

  let organizationId: string | null = null
  let teamId: string | null = null

  if (portal.requireOrg) {
    const member = await db.query.member.findFirst({
      where: (m, { eq }) => eq(m.userId, userId),
      columns: {
        organizationId: true,
      },
    })

    if (!member) {
      throw new APIError("FORBIDDEN", {
        message: "You don't have access to an organization.",
      })
    }

    organizationId = member.organizationId
  }

  if (portal.requireTeam) {
    const teamMember = await db.query.teamMember.findFirst({
      where: (tm, { eq }) => eq(tm.userId, userId),
      columns: {
        teamId: true,
      },
    })

    if (!teamMember) {
      throw new APIError("FORBIDDEN", {
        message: "You don't have access to an account.",
      })
    }

    teamId = teamMember.teamId
  }

  return {
    organizationId,
    teamId,
  }
}
