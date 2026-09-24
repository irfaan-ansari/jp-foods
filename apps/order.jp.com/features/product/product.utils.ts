import { PRODUCT_UNITS } from "./product.const"
import type { PricedSellingUnit, Product, SellUnit } from "./product.type"

type ProductWithUnits = {
  price?: Product["price"]
  uom?: Product["uom"]
  sellUnit?: Product["sellUnit"]
  unitSize?: Product["unitSize"]
  packSize?: Product["packSize"]
  catchWeight?: Product["catchWeight"]
  sellUnits?: SellUnit[] | null
}

const toNumber = (value: string | number | null | undefined, fallback = 0) => {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : fallback
}

const roundCurrency = (value: number) => Math.round(value * 100) / 100

export function getSellingUnits(
  product: ProductWithUnits
): PricedSellingUnit[] {
  const basePrice = toNumber(product.price)
  const unitSize = toNumber(product.unitSize, 1) || 1
  const packSize = toNumber(product.packSize, 1) || 1
  const sellUnit = product.sellUnit || product.sellUnits?.[0]?.name || "case"
  const uom = product.uom || "lb"
  const defaultUnitPrice = product.catchWeight
    ? roundCurrency(basePrice * unitSize * packSize)
    : roundCurrency(basePrice * packSize)

  return (product.sellUnits ?? []).map((unit) => ({
    ...unit,
    orderIncreament:
      unit.name === sellUnit
        ? String(toNumber(unit.orderIncreament, 1) || 1)
        : String(toNumber(unit.unitConversion, 1) || 1),
    price: String(
      Math.max(
        0,
        unit.name === sellUnit
          ? defaultUnitPrice
          : unit.price
            ? roundCurrency(
                toNumber(unit.price) /
                  (unitSize / (toNumber(unit.unitConversion, 1) || 1))
              )
            : roundCurrency(basePrice * toNumber(unit.unitConversion, 1))
      )
    ),
    displayLabel: unit.label || getUnit(unit.name)?.label || unit.name,
    displayUnit: unit.name === sellUnit ? sellUnit : uom,
    unitLabel:
      unit.name === sellUnit
        ? getUnit(sellUnit)?.label || sellUnit
        : getUnit(uom)?.label || uom,
    packDescription:
      unit.name === sellUnit
        ? `${unitSize} ${uom} ${sellUnit}`
        : `${unit.unitConversion || "—"} ${uom}`,
    isDefaultUnit: unit.name === sellUnit,
  }))
}

export const getUnit = (value: string | undefined) => {
  if (!value) return null
  return PRODUCT_UNITS.find((u) => u.value === value)
}
