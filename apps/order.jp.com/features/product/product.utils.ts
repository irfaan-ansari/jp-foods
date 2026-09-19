import { PRODUCT_UNITS } from "./product.const"
import type { PricedSellingUnit, Product } from "./product.type"

export function getSellingUnits(
  product: Partial<Pick<Product, "price" | "sellUnits">>
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

export function getLowestPriceUnit(sellUnits: PricedSellingUnit[]) {
  return sellUnits.reduce<PricedSellingUnit>((cheapest, unit) => {
    const pricePerBaseUnit =
      parseFloat(unit.price) / parseFloat(unit.unitConversion)

    const cheapestPricePerBaseUnit = cheapest
      ? parseFloat(cheapest.price) / parseFloat(cheapest.unitConversion)
      : Infinity

    return pricePerBaseUnit < cheapestPricePerBaseUnit ? unit : cheapest
  }, sellUnits[0]!)
}

export const getUnit = (value: string | undefined) => {
  if (!value) return null
  return PRODUCT_UNITS.find((u) => u.value === value)
}
