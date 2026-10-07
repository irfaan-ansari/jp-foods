import { env } from "@jp/utils/env"

export const getCatalogAccessUrl = (token: string | null) => {
  if (!token) return ""
  return `${env.NEXT_PUBLIC_API_URL}/api/v1/products/access?token=${token}&redirect=${env.NEXT_PUBLIC_PUBLIC_URL}/products`
}
