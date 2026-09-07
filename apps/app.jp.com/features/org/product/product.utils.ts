import { PRODUCT_UNITS } from "./product.const"

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

export const getInventoryUnits = (units: string[]) => {
  return PRODUCT_UNITS.filter((unit) => units.includes(unit.value))
}

export const getUnit = (value: string | undefined) => {
  if (!value) return null
  return PRODUCT_UNITS.find((u) => u.value === value)
}

export function getBaseUnit(units: { isBaseUnit?: boolean; unit: string }[]) {
  const unit = units.find((unit) => unit.isBaseUnit === true)
  return getUnit(unit?.unit ?? "")
}
