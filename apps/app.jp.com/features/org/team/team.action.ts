import { auth } from "@jp/auth"
import { eq } from "drizzle-orm"
import { AppError } from "@jp/utils/error"
import { db, team, teamProduct } from "@jp/db"
import { orgActionClient } from "@/lib/safe-action"
import { teamCreateSchema, teamUpdateSchema } from "./team.schema"

export const createTeam = orgActionClient({ team: ["create"] })
  .inputSchema(teamCreateSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { data } = parsedInput
    const { street, city, state, zip, privateItems, userIds, ...teamData } =
      data

    const existing = await db.query.team.findFirst({
      where: (team, { eq, or }) =>
        or(eq(team.email, data.email), eq(team.phoneNumber, data.phoneNumber)),
    })

    if (existing) {
      throw new AppError("CONFLICT", {
        message: "Email or phone number already exists",
      })
    }

    const res = await auth.api.createTeam({
      body: {
        ...teamData,
        metadata: {
          street,
          city,
          state,
          zip,
        },
        organizationId: ctx.organizationId,
      },
    })

    // add members
    await Promise.all([
      ...(Array.isArray(userIds)
        ? userIds.map((id) =>
            auth.api.addMember({
              body: {
                userId: id,
                role: "customer",
                organizationId: ctx.organizationId,
                teamId: res.id,
              },
            })
          )
        : []),

      ...(privateItems.length > 0
        ? [
            db.insert(teamProduct).values(
              privateItems.map((item) => ({
                teamId: res.id,
                productId: item.id,
              }))
            ),
          ]
        : []),
    ])

    return { id: res.id }
  })

export const updateTeam = orgActionClient({ team: ["update"] })
  .inputSchema(teamUpdateSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { id, data } = parsedInput

    const { street, city, state, zip, ...teamData } = data

    const existing = await db.query.team.findFirst({
      where: (team, { eq }) => eq(team.id, id),
    })

    if (!existing) {
      throw new AppError("NOT_FOUND")
    }

    await db
      .update(team)
      .set({ ...teamData, metadata: { street, city, state, zip } })
      .where(eq(team.id, id))

    return { id }
  })
