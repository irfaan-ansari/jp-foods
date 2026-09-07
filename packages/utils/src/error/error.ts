export const ERRORS = {
  UNAUTHORIZED: {
    status: 401,
    message: "Unauthorized",
    description: "You must be signed in.",
  },

  FORBIDDEN: {
    status: 403,
    message: "Access denied.",
    description:
      "You don't have the required permissions to perform this action.",
  },

  VALIDATION_ERROR: {
    status: 400,
    message: "Validation failed",
    description: "One or more fields are invalid.",
  },
  INVALID_REQUEST: {
    status: 400,
    message: "Invalid request",
    description: "The request could not be processed.",
  },
  NOT_FOUND: {
    status: 404,
    message: "Not found",
    description: "The requested resource could not be found.",
  },

  CONFLICT: {
    status: 409,
    message: "Conflict",
    description: "The request conflicts with existing data.",
  },

  TOO_MANY_REQUESTS: {
    status: 429,
    message: "Too many requests",
    description: "Please try again later.",
  },

  INTERNAL_SERVER_ERROR: {
    status: 500,
    message: "Internal server error",
    description: "An unexpected error occurred.",
  },
} as const

export type ErrorCode = keyof typeof ERRORS
export type ErrorStatus = (typeof ERRORS)[ErrorCode]["status"]
