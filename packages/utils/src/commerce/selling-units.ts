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
) =>
  displayLabel ||
  (name === stockUOM
    ? getUnit(name)?.label || name
    : `${catchWeight ? "~" : ""}${packSize} ${stockUOM} ${name}`)

export function withCalculatedPrices(product: ProductInput): SellUnit[] {
  const packSize = toNumber(product.packSize)
  const rate = toNumber(product.price)
  const name = product.sellUOM || product.stockUOM || ""
  const stockUOM = product.stockUOM || ""
  const catchWeight = product.pricingBasis === "catch-weight"

  // "fixed": price is per sell unit. "per-unit" / "catch-weight": price is per stock UOM.
  const perStockUOM = product.pricingBasis !== "fixed"

  const baseUnit: SellUnit = {
    name,
    displayLabel: label(
      getUnit(name)?.label || name,
      packSize,
      stockUOM,
      catchWeight
    ),
    price: perStockUOM ? roundMoney(rate * packSize) : rate,
    displayPrice: rate,
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
      displayPrice: perStockUOM ? roundMoney(price / splitPackSize) : price,
      packSize: splitPackSize,
      isDefault: false,
    }
  })

  return [baseUnit, ...splitUnits]
}
