type ActionSuccess<T> = {
  success: true
  data: T
  error: null
}

type ActionError = {
  success: false
  data: null
  error: {
    message: string
  }
}

export type ActionResult<T> = ActionSuccess<T> | ActionError

export function handleAction<Args extends unknown[], T>(
  action: (...args: Args) => Promise<T>
) {
  return async (...args: Args): Promise<ActionResult<T>> => {
    try {
      const data = await action(...args)

      return {
        success: true,
        data,
        error: null,
      }
    } catch (error) {
      console.error("Error:", error)
      const err =
        error! instanceof Error
          ? { message: "Unexpected error occurred. Please try again." }
          : { message: (error as Error).message || "Something went wrong." }

      return {
        success: false,
        data: null,
        error: err,
      }
    }
  }
}
