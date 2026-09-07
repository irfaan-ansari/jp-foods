import { AppError } from "./error/app-error"
import type { ErrorCode } from "./error/error"

function resolveUrl(url: string) {
  const API_URL = `http://localhost:3001`
  if (/^https?:\/\//i.test(url)) {
    return url
  }

  let path = url.startsWith("/") ? url : `/${url}`

  if (!path.startsWith("/api")) {
    path = `/api${path}`
  }

  return new URL(path, API_URL).toString()
}

export async function fetcher<T>(url: string): Promise<T> {
  let res: Response

  try {
    res = await fetch(resolveUrl(url), {
      credentials: "include",
    })
  } catch {
    throw new AppError("INTERNAL_SERVER_ERROR", {
      message: "Network error",
      description: "No internet connection. Please reconnect and try again.",
    })
  }

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new AppError(data.code as ErrorCode, {
      message: data.message,
      description: data.description,
    })
  }

  return data as T
}
