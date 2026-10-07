export const getCatalogAccessUrl = (token: string | null) => {
  if (!token) return ""
  return `${process.env.BETTER_AUTH_URL}/api/v1/products/access?token=${token}&redirect=${process.env.NEXT_PUBLIC_PUBLIC_URL}/products`
}
