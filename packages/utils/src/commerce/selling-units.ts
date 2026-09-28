import { MEASURE_UNITS } from "./units"

export type SellingUnitPriceInput = {
  name: string
  displayLabel?: string
  price: string | number
  qtyPerUnit: string | number
  minOrderQty: string | number
  orderIncrement: string | number
  isDefault: boolean
}

export type PricedSellingUnit<
  T extends SellingUnitPriceInput = SellingUnitPriceInput,
> = T & {
  calculatedPrice: number
}

export const roundMoney = (value: number) =>
  Math.round((value + Number.EPSILON) * 100) / 100

const decimal = (value: unknown) =>
  value === null || value === undefined || value === "" ? NaN : Number(value)

export const getUnit = (value: string | undefined) =>
  MEASURE_UNITS.find((unit) => unit.value === value)

export function withCalculatedPrices<T extends SellingUnitPriceInput>(
  units: T[],
  catchWeight: boolean
) {
  const names = new Set<string>()

  return units.flatMap((unit) => {
    const name = unit.name.trim()
    const price = decimal(unit.price)
    const qtyPerUnit = decimal(unit.qtyPerUnit)
    const minOrderQty = decimal(unit.minOrderQty ?? 1)
    const orderIncrement = decimal(unit.orderIncrement ?? 1)

    names.add(name)
    const calculatedPrice = roundMoney(catchWeight ? price * qtyPerUnit : price)

    if (!Number.isSafeInteger(Math.round(calculatedPrice * 100))) return []

    return [
      {
        ...unit,
        name,
        displayLabel: unit.displayLabel || name,
        minOrderQty,
        price,
        calculatedPrice,
        catchWeight,
        orderIncrement,
      },
    ]
  })
}

export function isValidOrderQuantity(
  quantity: number,
  minimum = 1,
  increment = 1
) {
  const steps = (quantity - minimum) / increment
  return (
    Number.isFinite(quantity) &&
    Number.isFinite(steps) &&
    minimum > 0 &&
    increment > 0 &&
    quantity >= minimum &&
    Math.abs(steps - Math.round(steps)) < 1e-8
  )
}

export function normalizeOrderQuantity(
  quantity: number,
  minimum = 1,
  increment = 1
) {
  if (!Number.isFinite(quantity) || quantity <= 0) return 0
  return Number(
    (
      minimum +
      Math.ceil(Math.max(0, quantity - minimum) / increment) * increment
    ).toFixed(8)
  )
}
