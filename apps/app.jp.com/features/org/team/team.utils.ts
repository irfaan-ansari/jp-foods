import { auth } from "@jp/auth"
import { db, teamMember, teamProduct } from "@jp/db"
import { and, eq, inArray } from "drizzle-orm"

export const syncTeamPrivateItems = async ({
  teamId,
  privateItemIds,
}: {
  teamId: string
  privateItemIds: number[]
}) => {
  const existingItems = await db.query.teamProduct.findMany({
    where: (teamProduct, { eq }) => eq(teamProduct.teamId, teamId),
  })

  const existingIds = new Set(existingItems.map((item) => item.productId))
  const nextIds = new Set(privateItemIds)

  const itemsToAdd = privateItemIds.filter((id) => !existingIds.has(id))

  const productIdsToRemove = existingItems
    .filter((item) => !nextIds.has(item.productId))
    .map((item) => item.productId)

  await Promise.all([
    productIdsToRemove.length > 0
      ? db
          .delete(teamProduct)
          .where(
            and(
              eq(teamProduct.teamId, teamId),
              inArray(teamProduct.productId, productIdsToRemove)
            )
          )
      : Promise.resolve(),

    itemsToAdd.length > 0
      ? db.insert(teamProduct).values(
          itemsToAdd.map((productId) => ({
            teamId,
            productId,
          }))
        )
      : Promise.resolve(),
  ])
}

export const syncTeamMembers = async ({
  teamId,
  organizationId,
  userIds = [],
}: {
  teamId: string
  organizationId: string
  userIds?: string[]
}) => {
  const currentMembers = await db.query.teamMember.findMany({
    where: (teamMember, { eq }) => eq(teamMember.teamId, teamId),
  })

  const currentUserIds = new Set(currentMembers.map((member) => member.userId))

  const nextUserIds = new Set(userIds)

  const usersToAdd = userIds.filter((userId) => !currentUserIds.has(userId))

  const membersToRemove = currentMembers.filter(
    (member) => !nextUserIds.has(member.userId)
  )

  let orgMembers = [] as Record<string, unknown>[]

  if (usersToAdd.length > 0) {
    orgMembers = await db.query.member.findMany({
      where: (member, { and, eq, inArray }) =>
        and(
          eq(member.organizationId, organizationId),
          inArray(member.userId, usersToAdd)
        ),
    })
  }

  const orgMemberUserIds = new Set(orgMembers.map((member) => member?.userId))

  const existingOrgMembers = usersToAdd.filter((userId) =>
    orgMemberUserIds.has(userId)
  )

  const newOrgMembers = usersToAdd.filter(
    (userId) => !orgMemberUserIds.has(userId)
  )

  const promises: Promise<unknown>[] = []

  if (existingOrgMembers.length > 0) {
    promises.push(
      db.insert(teamMember).values(
        existingOrgMembers.map((userId) => ({
          id: crypto.randomUUID(),
          teamId,
          userId,
        }))
      )
    )
  }

  if (newOrgMembers.length > 0) {
    promises.push(
      ...newOrgMembers.map((userId) =>
        auth.api.addMember({
          body: {
            userId,
            role: "customer",
            organizationId,
            teamId,
          },
        })
      )
    )
  }

  if (membersToRemove.length > 0) {
    promises.push(
      db.delete(teamMember).where(
        inArray(
          teamMember.id,
          membersToRemove.map((member) => member.id)
        )
      )
    )
  }

  await Promise.all(promises)
}
