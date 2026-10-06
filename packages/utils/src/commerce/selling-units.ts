import { ProductInput, SellUnit } from "./types"
import { MEASURE_UNITS } from "./units"

export const roundMoney = (value: number) =>
  Math.round((value + Number.EPSILON) * 100) / 100

const toNumber = (value: unknown) => Number(value ?? 0)

export const getUnit = (value: string | undefined) =>
  MEASURE_UNITS.find((unit) => unit.value === value)

const label = (
  name: string,
  packSize: number,
  stockUOM: string,
  catchWeight: boolean,
  displayLabel?: string | null
) => {
  if (displayLabel) {
    return displayLabel
  }

  if (name === stockUOM) {
    return getUnit(name)?.label || name
  }
  if (packSize <= 0) return ""

  return `${catchWeight ? "~" : ""}${packSize} ${stockUOM} ${name}`
}

export function withCalculatedPrices(product: ProductInput): SellUnit[] {
  const packSize = toNumber(product.packSize)
  const rate = toNumber(product.price)
  const name = product.sellUOM || product.stockUOM || ""
  const stockUOM = product.stockUOM || ""
  const catchWeight = product.pricingBasis === "catch-weight"

  // perStockUOM ? roundMoney(rate * packSize) : rate
  const baseUnit: SellUnit = {
    name,
    displayLabel: label(
      getUnit(name)?.label || name,
      packSize,
      stockUOM,
      catchWeight,
      product.displayLabel
    ),
    price: rate,
    packSize,
    isDefault: true,
  }

  const splitUnits = (product.splitUnits ?? []).map((unit): SellUnit => {
    const unitConversion = toNumber(unit.unitConversion)
    const sellUnitPrice = toNumber(unit.sellUnitPrice)
    const splitPackSize = Number((packSize / unitConversion).toFixed(4))
    const price = roundMoney(sellUnitPrice / unitConversion)

    return {
      name: unit.name,
      displayLabel: label(
        getUnit(unit.name)?.label || unit.name,
        splitPackSize,
        stockUOM,
        catchWeight,
        unit.displayLabel
      ),
      price,
      packSize: splitPackSize,
      isDefault: false,
    }
  })

  return [baseUnit, ...splitUnits]
}
