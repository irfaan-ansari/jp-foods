import { GetOptions } from "./types"
export function buildUrl(
  baseURL: string,
  path: string,
  params?: GetOptions["params"]
) {
  if (!baseURL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured")
  }

  const url = new URL(
    path.replace(/^\/+/, ""),
    `${baseURL.replace(/\/+$/, "")}/`
  )

  // collapse any repeated slashes in the final path
  url.pathname = url.pathname.replace(/\/{2,}/g, "/")

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value))
      }
    }
  }

  return url.toString()
}
