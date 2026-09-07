"use server"

import { db } from "@jp/db"
import { cache } from "react"
import { auth } from "@jp/auth"
import { headers } from "next/headers"
import { handleAction } from "@/lib/server-action"

export const getSession = cache(async () => {
  return await auth.api.getSession({ headers: await headers() })
})

/**
 * send otp to user
 * @param phoneNumber
 */
export const sendOtp = handleAction(
  async ({ phoneNumber }: { phoneNumber: string }) => {
    const account = await db.query.user.findFirst({
      where: (u, { eq }) => eq(u.phoneNumber, phoneNumber),
    })

    if (!account) throw new Error("Invalid phone number")

    return await auth.api.sendPhoneNumberOTP({
      body: {
        phoneNumber,
      },
    })
  }
)

export const verifyOtp = handleAction(
  async ({ phoneNumber, code }: { phoneNumber: string; code: string }) => {
    const account = await db.query.user.findFirst({
      where: (u, { eq }) => eq(u.phoneNumber, phoneNumber),
    })

    if (!account) throw new Error("Invalid phone number")

    return await auth.api.verifyPhoneNumber({
      body: {
        phoneNumber,
        code,
      },
    })
  }
)
