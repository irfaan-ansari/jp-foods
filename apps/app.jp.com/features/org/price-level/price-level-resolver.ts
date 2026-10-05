import { db } from "@jp/db"

import type { Product } from "../product/product.type"
import {
  createProductPriceResolver,
  withCalculatedPrices,
  type ProductInput,
} from "@jp/utils/commerce"

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
  return withCalculatedPrices({
    ...resolvedProduct,
    pricingBasis: resolvedProduct.pricingBasis as ProductInput["pricingBasis"],
    splitUnits: resolvedProduct.splitUnits ?? [],
  }).find(
    (unit) => unit.name === unitName
  )?.price
}
