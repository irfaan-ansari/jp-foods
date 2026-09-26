import { db } from "@jp/db"
import { AppError } from "@jp/utils"
import { and, eq, inArray } from "drizzle-orm"

import { getSellingUnits } from "../product/product.utils"
import { getTeamPriceResolver } from "../team/team.price-resolver"
import { toOrderItemInput } from "./order-form.utils"
import { isValidQuantity } from "@jp/utils/commerce"

export type RequestedOrderItem = {
  id: number
  unitName: string
  quantity: number
}

const lineKey = (productId: number, unitName: string) =>
  `${productId}:${unitName}`

export async function resolveOrderItems(
  requestedItems: RequestedOrderItem[],
  organizationId: string,
  teamId: string
) {
  const ids = [...new Set(requestedItems.map((item) => item.id))]
  const [products, privateProducts, resolvePrice] = await Promise.all([
    db.query.product.findMany({
      where: (product) =>
        and(
          eq(product.organizationId, organizationId),
          inArray(product.id, ids)
        ),
    }),
    db.query.teamProduct.findMany({
      where: (teamProduct) => eq(teamProduct.teamId, teamId),
      columns: { productId: true },
    }),
    getTeamPriceResolver(teamId),
  ])

  const privateIds = new Set(privateProducts.map((item) => item.productId))
  const productsById = new Map(products.map((product) => [product.id, product]))
  const seen = new Set<string>()
  const inventoryByProduct = new Map<number, number>()

  const items = requestedItems.map((request) => {
    const key = lineKey(request.id, request.unitName)
    if (seen.has(key)) {
      throw new AppError("INVALID_REQUEST", {
        message: "The same product and selling unit was added twice.",
      })
    }
    seen.add(key)

    const product = productsById.get(request.id)
    if (
      !product ||
      !(product.status === "active" ||
        (product.status === "private" && privateIds.has(product.id)))
    ) {
      throw new AppError("INVALID_REQUEST", {
        message: "A selected product is no longer available.",
      })
    }

    const pricedProduct = resolvePrice(product)
    const unit = getSellingUnits(pricedProduct).find(
      (sellingUnit) => sellingUnit.name === request.unitName
    )
    if (!unit) {
      throw new AppError("INVALID_REQUEST", {
        message: "A selected selling unit is no longer available.",
      })
    }

    const minimum = unit.min
    const increment = unit.increament
    const conversion = unit.contains
    const price = unit.calculatedPrice
    if (
      !Number.isFinite(minimum) ||
      minimum <= 0 ||
      !Number.isFinite(increment) ||
      increment <= 0 ||
      !Number.isFinite(conversion) ||
      conversion <= 0 ||
      !Number.isFinite(price) ||
      price < 0 ||
      !isValidQuantity(request.quantity, minimum, increment)
    ) {
      throw new AppError("INVALID_REQUEST", {
        message: `Quantity for ${product.title} must meet the ${unit.name} minimum and increment.`,
      })
    }

    inventoryByProduct.set(
      request.id,
      (inventoryByProduct.get(request.id) ?? 0) + request.quantity * conversion
    )

    return {
      ...toOrderItemInput(pricedProduct, unit),
      quantity: request.quantity,
    }
  })

  for (const product of products) {
    if (!product.trackInventory || product.allowBackorder) continue

    const stock = Number(product.stock)
    if (
      !Number.isFinite(stock) ||
      (inventoryByProduct.get(product.id) ?? 0) > stock
    ) {
      throw new AppError("INVALID_REQUEST", {
        message: `${product.title} does not have enough stock for the selected selling units.`,
      })
    }
  }

  return items
}
