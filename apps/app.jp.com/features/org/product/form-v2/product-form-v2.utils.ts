import { PRODUCT_UNITS } from "../product.const"
import type { ProductFormV2Schema } from "./product-form-v2.schema"

export const getAvailableUnitsV2 = (units: string[], index: number) => {
  const currentUnit = units[index]
  const usedUnits = units
    .map((unit, i) => (i === index ? null : unit))
    .filter(Boolean)

  return PRODUCT_UNITS.filter(
    (option) =>
      option.value === currentUnit || !usedUnits.includes(option.value)
  )
}

export const getUnitV2 = (value: string | undefined) => {
  if (!value) return null
  return PRODUCT_UNITS.find((unit) => unit.value === value)
}

export const toDecimal = (value: string | number | undefined) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export const calculateUnitPrice = (
  parentPrice: string | number | undefined,
  quantityPerUnit: string | number | undefined
) => {
  const price = toDecimal(parentPrice)
  const quantity = toDecimal(quantityPerUnit)

  if (!price || !quantity) return ""
  return (price * quantity).toFixed(2)
}

export const calculateUnitPrices = (
  sellUnits: ProductFormV2Schema["sellUnits"]
) => {
  const priceByUnit = new Map<string, string>()
  const baseUnit = sellUnits.find((unit) => unit.isBaseUnit)

  if (baseUnit?.name) {
    priceByUnit.set(baseUnit.name, baseUnit.price)
  }

  for (let pass = 0; pass < sellUnits.length; pass++) {
    sellUnits.forEach((unit, index) => {
      const containedUnitName = sellUnits[index - 1]?.name

      if (unit.isBaseUnit || !unit.name || !containedUnitName) return

      const parentPrice = priceByUnit.get(containedUnitName)
      const price = calculateUnitPrice(parentPrice, unit.quantityPerUnit)

      if (price) {
        priceByUnit.set(unit.name, price)
      }
    })
  }

  return priceByUnit
}

export const getUnitContentLabel = (
  unit: ProductFormV2Schema["sellUnits"][number],
  containedUnitName?: string
) => {
  if (unit.isBaseUnit) return "Single unit"

  const childLabel = getUnitV2(containedUnitName)?.label ?? containedUnitName
  const parentLabel = getUnitV2(unit.name)?.label ?? unit.name

  return `${unit.quantityPerUnit || 0} ${childLabel} per ${parentLabel}`
}

export const getUnitPackageLabel = (
  unit: ProductFormV2Schema["sellUnits"][number],
  containedUnitName?: string
) => {
  const parentLabel = getUnitV2(unit.name)?.label ?? unit.name
  const childValue = getUnitV2(containedUnitName)?.value ?? containedUnitName

  if (unit.isBaseUnit) return parentLabel
  return `${parentLabel} of ${unit.quantityPerUnit || 0} ${childValue}`
}
