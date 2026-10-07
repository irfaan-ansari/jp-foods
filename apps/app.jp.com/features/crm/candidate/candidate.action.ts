"use server"

import { randomUUID } from "crypto"

import { eq } from "@jp/db/query"
import { AppError } from "@jp/utils"
import { db, jobApplication } from "@jp/db"

import { authActionClient } from "@/lib/safe-action"
import {
  deleteCandidateApplicationSchema,
  candidateApplicationStatusSchema,
  updateCandidateApplicationSchema,
} from "./candidate.schema"

import {
  sendCandidateEmail,
  startOnboarding,
  startVerification,
} from "./candidate.utils"

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

    const token =
      status === "agreement_sent" ? (exist.token ?? randomUUID()) : undefined
    const candidateStatus =
      status ?? candidateApplicationStatusSchema.parse(exist.status)

    await db
      .update(jobApplication)
      .set({
        ...rest,
        status,
        ...(token ? { token } : {}),
        reviewedBy: user.id,
        reviewedAt: new Date(),
      })
      .where(eq(jobApplication.id, id))

    if (status === "under_verification") {
      await startVerification()
    }

    if (status === "hired") {
      await startOnboarding()
    }

    await sendCandidateEmail({
      candidate: {
        ...exist,
        status: candidateStatus,
        token: token ?? exist.token,
      },
      status,
      statusDetails: rest.statusDetails,
      statusReason: rest.statusReason,
      internalNotes: rest.internalNotes,
    })

    return { id }
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
