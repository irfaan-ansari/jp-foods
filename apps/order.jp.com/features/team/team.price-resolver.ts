import { createProductPriceResolver } from "@jp/utils/commerce"
import { db } from "@jp/db"

import type { Product } from "../product/product.type"
import { getSellingUnits } from "../product/product.utils"



async function getPriceLevel(teamId: string) {
  const team = await db.query.team.findFirst({
    where: (team, { eq }) => eq(team.id, teamId),
    with: { priceLevel: { with: { priceLevelItem: true } } },
  })

  return team?.priceLevel
}

export async function getTeamPriceResolver(teamId: string) {
  return createProductPriceResolver(await getPriceLevel(teamId))
}

export async function resolveTeamPrices<T extends Product>({
  products,
  teamId,
}: {
  products: T[]
  teamId: string
}) {
  const resolve = await getTeamPriceResolver(teamId)
  return products.map(resolve)
}

export async function resolveTeamPrice({
  product,
  unitName,
  teamId,
}: {
  product: Product
  unitName: string
  teamId: string
}) {
  const resolve = await getTeamPriceResolver(teamId)
  return getSellingUnits(resolve(product)).find(
    (unit) => unit.name === unitName
  )?.price
}

