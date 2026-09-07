"use server"

import { eq } from "drizzle-orm"
import { AppError } from "@jp/utils"
import { db, jobApplication } from "@jp/db"

import { authActionClient } from "@/lib/safe-action"
import {
  deleteCandidateApplicationSchema,
  processCandidateApplicationSchema,
  updateCandidateApplicationSchema,
  updateCandidateApplicationStatusSchema,
} from "./candidate.schema"
import { startOnboarding, startVerification } from "./candidate.utils"

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
        reviewedBy: user.id,
      })
      .where(eq(jobApplication.id, id))

    return { id: 1 }
  })

// accept or start verification
export const processCandidateApplication = authActionClient({
  "candidate-application": ["update"],
})
  .inputSchema(processCandidateApplicationSchema)
  .action(async ({ ctx, clientInput }) => {
    const { user } = ctx
    const { id, data } = clientInput

    const exist = await db.query.jobApplication.findFirst({
      where: (c, { eq }) => eq(c.id, id),
    })
    if (!exist) throw new AppError("NOT_FOUND")

    if (data.status === "accepted") {
      await startOnboarding()
    }
    if (data.status === "verification_in_progress") {
      await startVerification()
    }

    await db
      .update(jobApplication)
      .set({
        status: data.status,
        reviewedBy: user.id,
        reviewedAt: new Date(),
      })
      .where(eq(jobApplication.id, id))

    // quee email
    return { id: exist.id }
  })

//  reject
export const updateCandidateApplicationStatus = authActionClient({
  "candidate-application": ["update"],
})
  .inputSchema(updateCandidateApplicationStatusSchema)
  .action(async ({ ctx, clientInput }) => {
    const { user } = ctx
    const { id, data } = clientInput

    const exist = await db.query.jobApplication.findFirst({
      where: (c, { eq }) => eq(c.id, id),
    })
    if (!exist) throw new AppError("NOT_FOUND")

    await db
      .update(jobApplication)
      .set({
        status: data.status,
        statusReason: data.statusReason,
        statusDetails: data.statusDetails,
        reviewedBy: user.id,
        reviewedAt: new Date(),
      })
      .where(eq(jobApplication.id, id))

    // quee email
    return { id: id }
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
