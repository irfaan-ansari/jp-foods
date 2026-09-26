import { db } from "@jp/db"

import type { Product } from "../product/product.type"
import { withCalculatedPrices } from "@jp/utils/commerce"
import { createProductPriceResolver } from "@jp/utils/commerce"

export const getTeamPriceResolver = async (teamId: string) => {
  const team = await db.query.team.findFirst({
    where: (team, { eq }) => eq(team.id, teamId),
    with: { priceLevel: { with: { priceLevelItem: true } } },
  })
  return createProductPriceResolver(team?.priceLevel)
}

export const resolveTeamPrices = async <T extends Product>({
  products,
  teamId,
}: {
  products: T[]
  teamId: string
}) => {
  const resolve = await getTeamPriceResolver(teamId)
  return products.map(resolve)
}

export const resolveTeamPrice = async ({
  product,
  unitName,
  teamId,
}: {
  product: Product
  unitName: string
  teamId: string
}) => {
  const resolve = await getTeamPriceResolver(teamId)
  const resolvedProduct = resolve(product)
  return withCalculatedPrices(
    resolvedProduct.sellingUnits ?? [],
    !!resolvedProduct.catchWeight
  ).find(
    (unit) => unit.name === unitName
  )?.price
}
