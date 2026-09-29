"use server"

import { eq } from "drizzle-orm"
import { AppError } from "@jp/utils"
import { db, jobApplication } from "@jp/db"

import { authActionClient } from "@/lib/safe-action"
import {
  deleteCandidateApplicationSchema,
  updateCandidateApplicationSchema,
} from "./candidate.schema"
import { startOnboarding, startVerification } from "./candidate.utils"
import { sendEmail } from "@jp/notifications"
import {
  JobApplicationAdminEmail,
  JobApplicationDeclinedEmail,
} from "@jp/notifications/templates"

// update fields
export const updateCandidateApplication = authActionClient({
  "candidate-application": ["update"],
})
  .inputSchema(updateCandidateApplicationSchema)
  .action(async ({ ctx, clientInput }) => {
    const { user } = ctx
    const { id, data } = clientInput
    const { status, ...rest } = data

    const exist = await db.query.jobApplication.findFirst({
      where: (c, { eq }) => eq(c.id, id),
    })

    if (!exist) throw new AppError("NOT_FOUND")

    await db
      .update(jobApplication)
      .set({
        ...rest,
        status,
        reviewedBy: user.id,
        reviewedAt: new Date(),
      })
      .where(eq(jobApplication.id, id))

    // start onboarding if status is hired
    // start verification if status is verification_in_progress

    if (status === "rejected") {
      await Promise.all([
        sendEmail({
          to: exist.email,
          subject: "Jimenez Produce - Application Status Update",
          template: JobApplicationDeclinedEmail({
            name: exist.firstName,
            position: exist.position,
            reason: rest.statusReason ?? "",
            detailedReason: rest.statusDetails ?? "",
          }),
        }),
        sendEmail({
          subject: "Candidate Application Status Update",
          template: JobApplicationAdminEmail({
            name: exist.firstName,
            location: exist.location ?? "",
            email: exist.email,
            phone: exist.phone,
            position: exist.position,
            status: "rejected",
          }),
        }),
      ])
    }

    return { id: 1 }
  })

// delete
export const deleteCandidateApplication = authActionClient({
  "candidate-application": ["delete"],
})
  .inputSchema(deleteCandidateApplicationSchema)
  .action(async ({ clientInput }) => {
    const { id } = clientInput

    const exist = await db.query.jobApplication.findFirst({
      where: (c, { eq }) => eq(c.id, id),
    })
    if (!exist) throw new AppError("NOT_FOUND")

    await db.delete(jobApplication).where(eq(jobApplication.id, id))

    return { id: id }
  })
