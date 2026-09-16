"use server"
import { auth } from "@jp/auth"
import { and, eq } from "drizzle-orm"
import { AppError } from "@jp/utils/error"
import { db, team, teamMember, teamProduct } from "@jp/db"
import { orgActionClient } from "@/lib/safe-action"
import {
  addTeamMemberSchema,
  addTeamPrivateItemSchem,
  teamCreateSchema,
  teamUpdateSchema,
} from "./team.schema"
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

/**
 * Add team member
 */
export const addTeamMember = orgActionClient({ team: ["update"] })
  .inputSchema(addTeamMemberSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { userId, teamId } = parsedInput
    const organizationId = ctx.organizationId

    const exist = await db.query.teamMember.findFirst({
      where: (tm, { eq, and }) =>
        and(eq(tm.teamId, teamId), eq(tm.userId, userId)),
    })

    if (exist)
      throw new AppError("CONFLICT", {
        message: "User already exists",
      })

    const member = await db.query.member.findFirst({
      where: (m, { and, eq }) =>
        and(eq(m.organizationId, organizationId), eq(m.userId, userId)),
    })

    if (member) {
      await db
        .insert(teamMember)
        .values({ id: crypto.randomUUID(), teamId, userId })
    } else {
      await auth.api.addMember({
        body: {
          userId,
          role: "customer",
          organizationId,
          teamId,
        },
      })
    }

    return { id: teamId }
  })

export const addTeamPrivateItem = orgActionClient({ team: ["update"] })
  .inputSchema(addTeamPrivateItemSchem)
  .action(async ({ ctx, parsedInput }) => {
    const { teamId, productId } = parsedInput

    const existing = await db.query.teamProduct.findFirst({
      where: (tp, { eq, and }) =>
        and(eq(tp.teamId, teamId), eq(tp.productId, productId)),
    })
    if (existing)
      throw new AppError("CONFLICT", { message: "Product already exists" })

    const [result] = await db
      .insert(teamProduct)
      .values({ teamId, productId })
      .returning({ id: teamProduct.id })

    return { id: result?.id }
  })
