import { PRODUCT_UNITS } from "./product.const"
import type { PricedSellingUnit, Product } from "./product.type"

export const getSellingUnits = (
  product: Pick<Product, "price" | "uom" | "sellUnits">
): PricedSellingUnit[] => {
  const units = product.sellUnits?.length
    ? product.sellUnits
    : product.uom
      ? [
          {
            name: product.uom,
            unitConversion: "1",
            minQuantity: "1",
            orderIncreament: "1",
          },
        ]
      : []

  return units.map((unit) => ({
    ...unit,
    price: String(
      Math.round(Number(product.price) * Number(unit.unitConversion) * 100) /
        100
    ),
  }))
}

export const getAvailableUnits = (units: string[], index: number) => {
  const currentUnit = units[index]

  const usedUnits = units
    .map((u, i) => (i === index ? null : u))
    .filter(Boolean)

  return PRODUCT_UNITS.filter(
    (option) =>
      option.value === currentUnit || !usedUnits.includes(option.value)
  )
}

export const getUnit = (value: string | undefined) => {
  if (!value) return null
  return PRODUCT_UNITS.find((u) => u.value === value)
}
