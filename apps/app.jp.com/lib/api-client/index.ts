import { createApiClient } from "@jp/utils"

export const apiClient = createApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
  basePath: "/api/v1",
})
