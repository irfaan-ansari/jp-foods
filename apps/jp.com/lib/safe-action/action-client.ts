import { createSafeActionClient } from "next-safe-action"

import { AppError } from "@jp/utils"

// public
export const actionClient = createSafeActionClient({
  handleServerError(error) {
    console.error(error)
    if (error instanceof AppError)
      return {
        code: error.code,
        status: error.status,
        message: error.message,
        description: error.description,
      }

    return {
      code: "INTERNAL_SERVER_ERROR",
      status: 500,
      message: error.message,
    }
  },
})
