import { db } from "@jp/db"

export const getActiveAccount = async (userId: string) => {
  const user = await db.query.user.findFirst({
    where: (u, { eq }) => eq(u.id, userId),
  })

  const { defaultOrganizationId, defaultTeamId } = user ?? {}

  return { teamId: defaultTeamId, organizationId: defaultOrganizationId }
}
