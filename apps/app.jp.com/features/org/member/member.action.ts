"use server"

import { auth, OrganizationRole } from "@jp/auth"
import { orgActionClient } from "@/lib/safe-action"
import {
  createMemberActionSchema,
  updateMemberActionSchema,
} from "./member.schema"
import { headers } from "next/headers"

export const createMember = orgActionClient({ member: ["create"] })
  .inputSchema(createMemberActionSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { userId, role } = parsedInput
    const data = await auth.api.addMember({
      body: {
        userId: userId,
        role: role as OrganizationRole,
        organizationId: ctx.organizationId,
      },
    })

    return { id: data.id }
  })

export const updateMember = orgActionClient({ member: ["update"] })
  .inputSchema(updateMemberActionSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { memberId, role } = parsedInput

    const data = await auth.api.updateMemberRole({
      body: {
        role: role as OrganizationRole,
        memberId,
        organizationId: ctx.organizationId,
      },

      headers: await headers(),
    })

    return { id: data.id }
  })
