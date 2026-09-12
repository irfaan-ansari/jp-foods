import {
  db,
  PriceLevelItemSelectType,
  ProductSelectType,
  ProductSellUnitSelectType,
} from "@jp/db"
import { getNewPrice } from "./price-level.utils"
import { PriceLevelItem } from "./price-level.type"
import { Product } from "../product/product.type"

const getPriceLevelConfig = async (teamId: string) => {
  const team = await db.query.team.findFirst({
    where: (team, { eq }) => eq(team.id, teamId),
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

  const items = new Map<string, PriceLevelItem>(
    config?.priceLevelItem.map((item) => [
      `${item.productId}:${item.sellUnitId}`,
      item,
    ]) ?? []
  )

  return <T extends Product>(product: T): T => {
    const sellUnits = product.sellUnits.map((sellUnit) => {
      let price = sellUnit.price

      if (config?.appliesTo === "all") {
        price = getNewPrice(
          config.adjustmentType,
          sellUnit.price,
          config.adjustmentValue
        )
      } else if (config?.appliesTo === "per_item") {
        const item = items.get(`${product.id}:${sellUnit.id}`)

        if (item) {
          price = getNewPrice(config.adjustmentType, sellUnit.price, item.price)
        }
      }

      return {
        ...sellUnit,
        price,
      }
    })

    return {
      ...product,
      sellUnits,
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
  sellUnitId,
  teamId,
}: {
  product: Product
  sellUnitId: number
  teamId: string
}) => {
  const resolvePrice = await getTeamPriceResolver(teamId)

  return resolvePrice(product).sellUnits.find(
    (sellUnit) => sellUnit.id === sellUnitId
  )?.price
}
