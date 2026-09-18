import { db } from "@jp/db"
import { createProductPriceResolver, getSellingUnits } from "@jp/utils"
import type { Product } from "../product/product.type"

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
  return getSellingUnits(resolve(product)).find(
    (unit) => unit.name === unitName
  )?.price
}
