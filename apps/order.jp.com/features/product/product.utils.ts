import { PRODUCT_UNITS } from "./product.const"
import type { PricedSellingUnit, Product, SellUnit } from "./product.type"

type ProductWithUnits = {
  price?: Product["price"]
  sellUnits?: SellUnit[] | null
}

export function getSellingUnits(
  product: ProductWithUnits
): PricedSellingUnit[] {
  return (product.sellUnits ?? []).map((unit) => ({
    ...unit,
    price: String(
      Math.max(
        0,
        Math.round(Number(product.price) * Number(unit.unitConversion) * 100) /
          100
      )
    ),
  }))
}

export const getUnit = (value: string | undefined) => {
  if (!value) return null
  return PRODUCT_UNITS.find((u) => u.value === value)
}
