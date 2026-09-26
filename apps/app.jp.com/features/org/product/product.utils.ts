export { getSellingUnits, getUnit } from "@jp/utils/commerce"
export type { SellingUnit as PricedSellingUnit } from "@jp/utils/commerce"

type SellingUnit = {
  name: string
  displayLabel: string
  price: string
  qtyPerUnit: string
  isDefault: boolean
}

export function withCalculatedPrices<T extends SellingUnit>(
  units: T[],
  catchWeight: boolean
): (T & { calculatedPrice: number })[] {
  if (!catchWeight) {
    return units.map((unit) => ({
      ...unit,
      displayLabel: unit.displayLabel || unit.name,
      calculatedPrice: Number(unit.price),
    }))
  }

  return units.map((unit) => ({
    ...unit,
    displayLabel: unit.displayLabel || unit.name,
    calculatedPrice: Number(unit.price) * Number(unit.qtyPerUnit),
  }))
}
