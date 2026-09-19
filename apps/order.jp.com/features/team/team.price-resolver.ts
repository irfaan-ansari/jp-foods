import { db } from "@jp/db"

import type { Product } from "../product/product.type"
import { getSellingUnits } from "../product/product.utils"

type PriceLevel = NonNullable<Awaited<ReturnType<typeof getPriceLevel>>>

async function getPriceLevel(teamId: string) {
  const team = await db.query.team.findFirst({
    where: (team, { eq }) => eq(team.id, teamId),
    with: { priceLevel: { with: { priceLevelItem: true } } },
  })

  return team?.priceLevel
}

function roundPrice(value: number) {
  return Math.max(0, Math.round(value * 100) / 100)
}

export function createProductPriceResolver(config?: PriceLevel | null) {
  const pricesByProduct = new Map(
    config?.priceLevelItem.map((item) => [item.productId, item.price])
  )

  return <T extends Pick<Product, "id" | "price">>(product: T): T => {
    if (!config || config.status !== "active") return product

    const selectedAdjustment = pricesByProduct.get(product.id)
    const adjustment =
      config.appliesTo === "all" ? config.adjustmentValue : selectedAdjustment

    if (adjustment === undefined) return product

    const basePrice = Number(product.price)
    const value = Number(adjustment)
    if (!Number.isFinite(basePrice) || !Number.isFinite(value)) return product

    const nextPrice =
      config.adjustmentType === "percentage"
        ? basePrice + (basePrice * value) / 100
        : config.appliesTo === "all"
          ? basePrice + value
          : value

    return { ...product, price: String(roundPrice(nextPrice)) }
  }
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
