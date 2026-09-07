import { AppError } from "../error"
import { buildUrl } from "./build-url"
import { ApiClientOptions, GetOptions } from "./types"

export function createApiClient({ baseURL, basePath = "" }: ApiClientOptions) {
  async function get<T>(path: string, options?: GetOptions): Promise<T> {
    const fullPath = `${basePath}${path}`

    const url = buildUrl(baseURL, fullPath, options?.params)

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: options?.headers,
      signal: options?.signal,
    })

    const contentType = response.headers.get("content-type")

    const data = contentType?.includes("application/json")
      ? await response.json().catch(() => null)
      : await response.text()

    if (!response.ok) {
      throw new AppError("INTERNAL_SERVER_ERROR")
    }

    return data as T
  }

  return {
    get,
  }
}
