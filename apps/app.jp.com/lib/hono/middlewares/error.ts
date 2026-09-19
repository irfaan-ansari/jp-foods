import { DrizzleQueryError } from "drizzle-orm/errors"
import type { Context } from "hono"

import { AppError } from "@jp/utils"

export function errorHandler(err: Error, c: Context) {
  if (err instanceof AppError) {
    return c.json(
      {
        code: err.code,
        success: false,
        message: err.message,
        description: err.description,
      },
      err.status
    )
  }

  if (err instanceof DrizzleQueryError) {
    console.error("Database error:", err)
  } else {
    console.error(err)
  }

  return c.json(
    {
      code: "INTERNAL_SERVER_ERROR",
      success: false,
      message: "Internal server error",
      description: "An unexpected error occurred.",
    },
    500
  )
}
