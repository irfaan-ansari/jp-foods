import { type ErrorCode, ERRORS, type ErrorStatus } from "./error"

type AppErrorOptions = {
  message?: string
  description?: string
}

export class AppError extends Error {
  readonly code: ErrorCode
  readonly status: ErrorStatus
  readonly description: string

  constructor(code: ErrorCode, options: AppErrorOptions = {}) {
    super(options.message ?? ERRORS[code].message)

    this.name = "AppError"
    this.code = code
    this.status = ERRORS[code].status
    this.description = options.description ?? ERRORS[code].description
  }
}
