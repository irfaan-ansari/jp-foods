"use server"

import { db } from "@jp/db"
import { cache } from "react"
import { auth } from "@jp/auth"
import { headers } from "next/headers"
import { actionClient } from "@/lib/safe-action"
import { sendOtpSchema, verifyOtpSchema } from "./auth.schema"
import { AppError } from "@jp/utils"

export const getSession = cache(async () => {
  return await auth.api.getSession({ headers: await headers() })
})

/**
 * send otp to user
 * @param phoneNumber
 */
export const sendOtp = actionClient
  .inputSchema(sendOtpSchema)
  .action(async ({ clientInput }) => {
    const { phoneNumber } = clientInput
    const account = await db.query.user.findFirst({
      where: (u, { eq }) => eq(u.phoneNumber, phoneNumber),
    })

    if (!account)
      throw new AppError("INVALID_REQUEST", {
        message: "Invalid phone number",
      })

    return await auth.api.sendPhoneNumberOTP({
      body: {
        phoneNumber,
      },
    })
  })

export const verifyOtp = actionClient
  .inputSchema(verifyOtpSchema)
  .action(async ({ clientInput }) => {
    const { phoneNumber, code } = clientInput

    const account = await db.query.user.findFirst({
      where: (u, { eq }) => eq(u.phoneNumber, phoneNumber),
    })

    if (!account)
      throw new AppError("INVALID_REQUEST", {
        message: "Invalid phone number",
      })

    return await auth.api.verifyPhoneNumber({
      body: {
        phoneNumber,
        code,
      },
    })
  })
