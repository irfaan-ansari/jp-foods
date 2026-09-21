"use server"

import { eq } from "drizzle-orm"
import { waitUntil } from "@vercel/functions"
import { db, messageCampaign } from "@jp/db"
import { AppError } from "@jp/utils"

import { orgActionClient } from "@/lib/safe-action"
import {
  deleteMessageCampaignSchema,
  sendMessageActionSchema,
} from "./messaging.schema"
import {
  extractVariables,
  normalizePhoneNumber,
  parseManualNumbers,
} from "./messaging.utils"
import { sendMessageCampaign } from "./messaging.service"
import type { MessageRecipientDraft } from "./messaging.type"

const uniqueRecipients = (recipients: MessageRecipientDraft[]) => {
  const map = new Map<string, MessageRecipientDraft>()
  for (const recipient of recipients) {
    const phoneNumber = normalizePhoneNumber(recipient.phoneNumber)
    if (!phoneNumber || map.has(phoneNumber)) continue
    map.set(phoneNumber, { ...recipient, phoneNumber })
  }
  return [...map.values()]
}

export const sendBulkMessage = orgActionClient({ messaging: ["send"] })
  .inputSchema(sendMessageActionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { data } = parsedInput
    const organizationId = ctx.organizationId

    const manualRecipients: MessageRecipientDraft[] = parseManualNumbers(
      data.manualNumbers
    ).map((phoneNumber) => ({
      id: `manual:${phoneNumber}`,
      name: phoneNumber,
      phoneNumber,
      source: "manual",
    }))

    const teamMembers = await db.query.teamMember.findMany({
      where: (tm, { inArray }) => inArray(tm.teamId, data.teamIds as string[]),
      with: {
        user: true,
      },
    })

    const userRecipients: MessageRecipientDraft[] = teamMembers.flatMap(
      ({ user }) => ({
        id: `user:${user.id}`,
        name: user.name,
        phoneNumber: user.phoneNumber,
        source: "user",
        userId: user.id,
      })
    )

    const recipients = uniqueRecipients([
      ...manualRecipients,
      ...userRecipients,
    ])

    if (recipients.length === 0) {
      throw new AppError("VALIDATION_ERROR", {
        message: "Add at least one recipient.",
      })
    }

    const variables = extractVariables(data.message)
    const [created] = await db
      .insert(messageCampaign)
      .values({
        organizationId,
        name: data.name,
        message: data.message,
        templateKey: "custom",
        variables,
        status: "sending",
        recipientSource: "mixed",
        recipientCount: recipients.length,
        createdBy: ctx.user.id,
      })
      .returning({ id: messageCampaign.id })

    if (!created) throw new AppError("VALIDATION_ERROR")

    waitUntil(
      sendMessageCampaign({
        campaignId: created.id,
        organizationId,
        message: data.message,
        recipients,
      }).catch((error) => {
        console.error("Unable to persist bulk message campaign status", {
          campaignId: created.id,
          error,
        })
      })
    )

    return {
      id: created.id,
      status: "sending" as const,
      recipientCount: recipients.length,
    }
  })

export const deleteMessageCampaign = orgActionClient({ messaging: ["delete"] })
  .inputSchema(deleteMessageCampaignSchema)
  .action(async ({ parsedInput, ctx }) => {
    const existing = await db.query.messageCampaign.findFirst({
      where: (campaign, { and, eq }) =>
        and(
          eq(campaign.id, parsedInput.id),
          eq(campaign.organizationId, ctx.organizationId)
        ),
    })

    if (!existing) throw new AppError("NOT_FOUND")

    await db
      .delete(messageCampaign)
      .where(eq(messageCampaign.id, parsedInput.id))

    return { id: parsedInput.id }
  })
