"use server"

import { and, eq, inArray } from "drizzle-orm"
import { twilioSendSms } from "@jp/notifications"
import {
  db,
  member,
  messageCampaign,
  messageRecipient,
  organization,
  team,
  user,
} from "@jp/db"
import { AppError } from "@jp/utils"

import { orgActionClient } from "@/lib/safe-action"
import {
  deleteMessageCampaignSchema,
  sendMessageActionSchema,
} from "./messaging.schema"
import {
  extractVariables,
  getRecipientVariables,
  normalizePhoneNumber,
  parseManualNumbers,
  renderMessage,
} from "./messaging.utils"
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

    const org = await db.query.organization.findFirst({
      where: eq(organization.id, organizationId),
      columns: { name: true },
    })

    const teamIds = data.teams.map((item) => item.teamId).filter(Boolean)
    const userIds = data.users.map((item) => item.userId).filter(Boolean)

    const [teams, users] = await Promise.all([
      teamIds.length > 0
        ? db.query.team.findMany({
            where: and(
              eq(team.organizationId, organizationId),
              inArray(team.id, teamIds as string[])
            ),
          })
        : [],
      userIds.length > 0
        ? db
            .select({
              id: user.id,
              name: user.name,
              phoneNumber: user.phoneNumber,
            })
            .from(member)
            .innerJoin(user, eq(member.userId, user.id))
            .where(
              and(
                eq(member.organizationId, organizationId),
                inArray(member.userId, userIds as string[])
              )
            )
        : [],
    ])

    const manualRecipients: MessageRecipientDraft[] = parseManualNumbers(
      data.manualNumbers
    ).map((phoneNumber) => ({
      id: `manual:${phoneNumber}`,
      name: phoneNumber,
      phoneNumber,
      source: "manual",
    }))

    const teamRecipients: MessageRecipientDraft[] = teams.map((team) => ({
      id: `team:${team.id}`,
      name: team.name,
      phoneNumber: team.phoneNumber,
      source: "team",
      teamId: team.id,
      teamName: team.name,
    }))

    const userRecipients: MessageRecipientDraft[] = users.map((user) => ({
      id: `user:${user.id}`,
      name: user.name,
      phoneNumber: user.phoneNumber,
      source: "user",
      userId: user.id,
    }))

    const recipients = uniqueRecipients([
      ...manualRecipients,
      ...teamRecipients,
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
        templateKey: data.templateKey || "custom",
        variables,
        status: "sending",
        recipientSource: "mixed",
        recipientCount: recipients.length,
        createdBy: ctx.user.id,
      })
      .returning({ id: messageCampaign.id })

    if (!created) throw new AppError("VALIDATION_ERROR")

    let sentCount = 0
    let failedCount = 0
    const now = new Date()

    for (const recipient of recipients) {
      const vars = getRecipientVariables(recipient, org?.name ?? "")
      const rendered = renderMessage(data.message, vars)

      try {
        const result = await twilioSendSms({
          to: recipient.phoneNumber,
          body: rendered,
        })
        sentCount += 1
        await db.insert(messageRecipient).values({
          campaignId: created.id,
          organizationId,
          teamId: recipient.teamId,
          userId: recipient.userId,
          source: recipient.source,
          name: recipient.name,
          phoneNumber: recipient.phoneNumber,
          message: rendered,
          status: "sent",
          provider: "twilio",
          providerMessageId: result.sid,
          variables: vars,
          sentAt: new Date(),
        })
      } catch (error) {
        failedCount += 1
        await db.insert(messageRecipient).values({
          campaignId: created.id,
          organizationId,
          teamId: recipient.teamId,
          userId: recipient.userId,
          source: recipient.source,
          name: recipient.name,
          phoneNumber: recipient.phoneNumber,
          message: rendered,
          status: "failed",
          provider: "twilio",
          errorCode:
            error && typeof error === "object" && "code" in error
              ? String(error.code)
              : undefined,
          errorMessage:
            error instanceof Error ? error.message : "Unable to send message",
          variables: vars,
          failedAt: new Date(),
        })
      }
    }

    const status =
      failedCount === 0 ? "completed" : sentCount === 0 ? "failed" : "partial"

    await db
      .update(messageCampaign)
      .set({
        status,
        sentCount,
        failedCount,
        sentAt: now,
      })
      .where(eq(messageCampaign.id, created.id))

    return {
      id: created.id,
      sentCount,
      failedCount,
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
