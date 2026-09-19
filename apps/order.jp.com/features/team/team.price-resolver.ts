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

function toFiniteNumber(value: unknown) {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : null
}

export function createProductPriceResolver(config?: PriceLevel | null) {
  if (!config || config.status !== "active") return <T>(product: T) => product

  const itemPrices = new Map(
    config.priceLevelItem.map((item) => [item.productId, item.price])
  )

  const getAdjustment = (productId: number) =>
    config.appliesTo === "all"
      ? config.adjustmentValue
      : itemPrices.get(productId)

  const resolvePrice = (basePrice: number, adjustment: number) => {
    if (config.adjustmentType === "percentage") {
      return basePrice + (basePrice * adjustment) / 100
    }

    return config.appliesTo === "all" ? basePrice + adjustment : adjustment
  }

  return <T extends Pick<Product, "id" | "price">>(product: T): T => {
    const adjustment = getAdjustment(product.id)
    if (adjustment === undefined) return product

    const basePrice = toFiniteNumber(product.price)
    const adjustmentValue = toFiniteNumber(adjustment)
    if (basePrice === null || adjustmentValue === null) return product

    const nextPrice =
      resolvePrice(basePrice, adjustmentValue)

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
