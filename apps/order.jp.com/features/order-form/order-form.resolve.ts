import { db } from "@jp/db"
import { and, eq, inArray } from "drizzle-orm"

import { withCalculatedPrices } from "@jp/utils/commerce"
import { getTeamPriceResolver } from "../team/team.price-resolver"
import { toOrderItemInput } from "./order-form.utils"

export type RequestedOrderItem = {
  productId: number
  unit: string
  quantity: number
}

export async function resolveOrderItems(
  requestedItems: RequestedOrderItem[],
  organizationId: string,
  teamId: string
) {
  const ids = [...new Set(requestedItems.map((item) => item.productId))]

  const [products, resolvePrice] = await Promise.all([
    db.query.product.findMany({
      where: (product) =>
        and(
          eq(product.organizationId, organizationId),
          inArray(product.id, ids)
        ),
    }),
    getTeamPriceResolver(teamId),
  ])

  const productsById = new Map(products.map((product) => [product.id, product]))

  const items = requestedItems.map((request) => {
    const product = productsById.get(request.productId)!

    const pricedProduct = resolvePrice(product)

    const unit = withCalculatedPrices(
      pricedProduct.sellingUnits!,
      !!pricedProduct.catchWeight
    ).find((sellingUnit) => sellingUnit.name === request.unit)

    return {
      ...toOrderItemInput(pricedProduct, unit),
      quantity: request.quantity,
    }
  })

  return items
}
