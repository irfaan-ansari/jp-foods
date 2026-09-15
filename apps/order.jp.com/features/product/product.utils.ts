import { PRODUCT_UNITS } from "./product.const"
import { Product } from "./product.type"

export function getLowestPriceUnit(sellUnits: Product["sellUnits"]) {
  return sellUnits.reduce<Product["sellUnits"][number]>((cheapest, unit) => {
    const pricePerBaseUnit =
      parseFloat(unit.price) / parseFloat(unit.inventoryPerUnit)

    const cheapestPricePerBaseUnit = cheapest
      ? parseFloat(cheapest.price) / parseFloat(cheapest.inventoryPerUnit)
      : Infinity

    return pricePerBaseUnit < cheapestPricePerBaseUnit ? unit : cheapest
  }, sellUnits[0]!)
}

export const getUnit = (value: string | undefined) => {
  if (!value) return null
  return PRODUCT_UNITS.find((u) => u.value === value)
}
