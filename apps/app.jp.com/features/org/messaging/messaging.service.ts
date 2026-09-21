import { eq } from "drizzle-orm"
import { twilioSendSms } from "@jp/notifications"
import { db, messageCampaign, messageRecipient } from "@jp/db"

import { getRecipientVariables, renderMessage } from "./messaging.utils"
import type { MessageRecipientDraft } from "./messaging.type"

type SendMessageCampaignInput = {
  campaignId: number
  organizationId: string
  message: string
  recipients: MessageRecipientDraft[]
}

export async function sendMessageCampaign({
  campaignId,
  organizationId,
  message,
  recipients,
}: SendMessageCampaignInput) {
  let sentCount = 0
  let failedCount = 0

  try {
    for (const recipient of recipients) {
      const vars = getRecipientVariables(recipient)
      const rendered = renderMessage(message, vars)
      const record: typeof messageRecipient.$inferInsert = {
        campaignId: campaignId,
        organizationId,
        source: recipient.source,
        name: recipient.name,
        phoneNumber: recipient.phoneNumber,
        message: rendered,
        provider: "twilio",
        variables: vars,
      }

      try {
        const result = await twilioSendSms({
          to: recipient.phoneNumber,
          body: rendered,
        })
        record.status = "sent"
        record.providerMessageId = result.sid
        record.sentAt = new Date()
        sentCount += 1
      } catch (error) {
        record.status = "failed"
        record.errorCode =
          error && typeof error === "object" && "code" in error
            ? String(error.code)
            : undefined
        record.errorMessage =
          error instanceof Error ? error.message : "Unable to send message"
        record.failedAt = new Date()
        failedCount += 1
      }

      await db.insert(messageRecipient).values(record)
    }

    let status = ""
    if (failedCount === 0) {
      status = "completed"
    } else if (sentCount === 0) {
      status = "failed"
    } else {
      status = "partial"
    }

    await db
      .update(messageCampaign)
      .set({
        status,
        sentCount,
        failedCount,
        sentAt: new Date(),
      })
      .where(eq(messageCampaign.id, campaignId))
  } catch (error) {
    console.error("Bulk message processing failed", {
      campaignId: campaignId,
      error,
    })

    await db
      .update(messageCampaign)
      .set({
        status: sentCount > 0 ? "partial" : "failed",
        sentCount,
        failedCount,
        skippedCount: recipients.length - sentCount - failedCount,
      })
      .where(eq(messageCampaign.id, campaignId))
  }
}
