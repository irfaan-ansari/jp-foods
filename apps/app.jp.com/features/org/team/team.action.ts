"use server"
import { auth } from "@jp/auth"
import { and, eq } from "drizzle-orm"
import { AppError } from "@jp/utils/error"
import { db, team } from "@jp/db"
import { orgActionClient } from "@/lib/safe-action"
import { teamCreateSchema, teamUpdateSchema } from "./team.schema"
import { syncTeamMembers, syncTeamPrivateItems } from "./team.utils"

export const createTeam = orgActionClient({ team: ["create"] })
  .inputSchema(teamCreateSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { data } = parsedInput
    const { street, city, state, zipcode, privateItems, userIds, ...teamData } =
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
          zipcode,
        },
        organizationId: ctx.organizationId,
      },
    })

    await Promise.all([
      syncTeamPrivateItems({
        teamId: res.id,
        privateItemIds: privateItems?.map((item) => item.id) || [],
      }),

      syncTeamMembers({
        teamId: res.id,
        organizationId: ctx.organizationId,
        userIds: userIds || [],
      }),
    ])

    return { id: res.id }
  })

export const updateTeam = orgActionClient({ team: ["update"] })
  .inputSchema(teamUpdateSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { id, data } = parsedInput
    const { street, city, state, zipcode, userIds, privateItems, ...teamData } =
      data

    const existing = await db.query.team.findFirst({
      where: (team, { eq }) => eq(team.id, id),
    })

    if (!existing) {
      throw new AppError("NOT_FOUND")
    }

    const duplicate = await db.query.team.findFirst({
      where: (team, { and, ne, or, eq }) =>
        and(
          ne(team.id, id),
          or(eq(team.email, data.email), eq(team.phoneNumber, data.phoneNumber))
        ),
    })

    if (duplicate) {
      throw new AppError("CONFLICT", {
        message: "Email or phone number already exists",
      })
    }

    await db
      .update(team)
      .set({ ...teamData, metadata: { street, city, state, zipcode } })
      .where(and(eq(team.id, id), eq(team.organizationId, ctx.organizationId)))

    await Promise.all([
      syncTeamPrivateItems({
        teamId: id,
        privateItemIds: privateItems?.map((item) => item.id) || [],
      }),

      syncTeamMembers({
        teamId: id,
        organizationId: ctx.organizationId,
        userIds: userIds || [],
      }),
    ])

    return { id }
  })
