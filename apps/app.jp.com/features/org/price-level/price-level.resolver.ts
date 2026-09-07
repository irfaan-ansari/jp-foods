import { db } from "@jp/db"
import { Product } from "../product/product.type"
import { PriceLevelItem } from "./price-level.type"

type ResolvedProduct<T extends Product> = Omit<T, "basePrice"> & {
  price: number
}

const toNumber = (value: unknown) => Number(value)

const applyAdjustment = (basePrice: number, type: string, value: number) => {
  const delta = type === "fixed" ? value : (basePrice * value) / 100

  return Math.max(0, Math.round((basePrice + delta) * 100) / 100)
}

const getPriceLevelConfig = async (teamId: string) => {
  const team = await db.query.team.findFirst({
    where: (t, { eq }) => eq(t.id, teamId),
    with: {
      priceLevel: {
        with: {
          priceLevelItem: true,
        },
      },
    },
  })

  return team?.priceLevel
}

export const getTeamPriceResolver = async (teamId: string) => {
  const config = await getPriceLevelConfig(teamId)

  if (!config) {
    return <T extends Product>(product: T): ResolvedProduct<T> => ({
      ...product,
      price: toNumber(product.basePrice),
    })
  }

  const itemsByProductId =
    config.appliesTo === "selected"
      ? new Map<number, PriceLevelItem>(
          config.priceLevelItem.map((item) => [item.productId, item])
        )
      : undefined

  return <T extends Product>(product: T): ResolvedProduct<T> => {
    const { basePrice, ...rest } = product
    const base = toNumber(product.basePrice)

    let price = base

    if (config.appliesTo === "all") {
      price = applyAdjustment(
        base,
        config.adjustmentType,
        toNumber(config.adjustmentValue)
      )
    } else {
      const item = itemsByProductId?.get(product.id)

      if (item) {
        price = applyAdjustment(
          base,
          config.adjustmentType,
          toNumber(item.price)
        )
      }
    }

    return {
      ...rest,
      price,
    }
  }
}

export const resolveTeamPrices = async <T extends Product>({
  products,
  teamId,
}: {
  products: T[]
  teamId: string
}) => {
  const resolvePrice = await getTeamPriceResolver(teamId)

  return products.map(resolvePrice)
}

export const resolveTeamPrice = async ({
  product,
  teamId,
}: {
  product: Product
  teamId: string
}) => {
  const resolvePrice = await getTeamPriceResolver(teamId)

  return resolvePrice(product).price
}
