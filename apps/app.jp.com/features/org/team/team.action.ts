import { auth } from "@jp/auth"
import { db, team } from "@jp/db"
import { AppError } from "@jp/utils/error"
import { teamCreateSchema, teamUpdateSchema } from "./team.schema"
import { orgActionClient } from "@/lib/safe-action"
import { eq } from "drizzle-orm"

export const createTeam = orgActionClient({ team: ["create"] })
  .inputSchema(teamCreateSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { data } = parsedInput
    const { address, city, state, zip, ...teamData } = data
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
          address,
          city,
          state,
          zip,
        },
        organizationId: ctx.organizationId,
      },
    })

    return { id: res.id }
  })

export const updateTeam = orgActionClient({ team: ["update"] })
  .inputSchema(teamUpdateSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { id, data } = parsedInput

    const { address, city, state, zip, ...teamData } = data

    const existing = await db.query.team.findFirst({
      where: (team, { eq }) => eq(team.id, id),
    })

    if (!existing) {
      throw new AppError("NOT_FOUND")
    }

    await db
      .update(team)
      .set({ ...teamData, metadata: { address, city, state, zip } })
      .where(eq(team.id, id))

    return { id }
  })
