import { db } from "@jp/db"
import { AppError } from "@jp/utils"
import { withCalculatedPrices } from "@jp/utils/commerce"
import { and, eq, inArray } from "@jp/db/query"


import { getTeamPriceResolver } from "../team/team.price-resolver"
import { toOrderItemInput } from "./order-form.utils"

export type RequestedOrderItem = {
  productId: number
  lineItemId?: number
  unit: string
  quantity: number
}

export async function resolveOrderItems(
  requestedItems: RequestedOrderItem[],
  organizationId: string,
  teamId: string
) {
  const ids = [...new Set(requestedItems.map((item) => item.productId))]

  const [products, privateProducts, resolvePrice] = await Promise.all([
    db.query.product.findMany({
      where: (product) =>
        and(
          eq(product.organizationId, organizationId),
          inArray(product.id, ids)
        ),
    }),
    db.query.teamProduct.findMany({
      where: (item, { eq }) => eq(item.teamId, teamId),
      columns: { productId: true },
    }),
    getTeamPriceResolver(teamId),
  ])

  const productsById = new Map(products.map((product) => [product.id, product]))
  const privateProductIds = new Set(privateProducts.map((item) => item.productId))

  const items = requestedItems.map((request) => {
    const product = productsById.get(request.productId)
    if (!product) throw new AppError("INVALID_REQUEST")
    if (
      ["archived", "draft"].includes(product.status ?? "") ||
      (product.status !== "active" && !privateProductIds.has(product.id))
    ) {
      throw new AppError("INVALID_REQUEST")
    }

    const pricedProduct = resolvePrice(product)
    const sellUnits = withCalculatedPrices({
      ...pricedProduct,
      splitUnits: pricedProduct.splitUnits ?? [],
    })
    const sellUnit = sellUnits.find((unit) => unit.name === request.unit)
    if (!sellUnit) throw new AppError("INVALID_REQUEST")

    return {
      ...toOrderItemInput({ ...pricedProduct, sellUnits }, sellUnit),
      lineItemId: request.lineItemId,
      quantity: request.quantity,
      unitQuantity: request.quantity * sellUnit.packSize,
    }
  })

  return items
}
