import { apiClient } from "@/lib/api-client"
import type { CatalogResponse } from "./catalog.type"

export async function getCatalogProducts(kv?: Record<string, any>) {
  return apiClient.get<CatalogResponse>("/products", {
    params: kv,
  })
}
