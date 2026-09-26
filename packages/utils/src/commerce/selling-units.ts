import { PRODUCT_UNITS } from "./units"

export type SellingUnitPriceInput = {
  name: string
  displayLabel?: string
  price: string | number
  qtyPerUnit: string | number
  minOrderQty?: string | number
  orderIncrement?: string | number
  isDefault?: boolean
}

export type PricedSellingUnit<
  T extends SellingUnitPriceInput = SellingUnitPriceInput,
> = Omit<T, "displayLabel" | "price"> & {
    displayLabel: string
    label: string
    min: number
    price: number
    calculatedPrice: number
    catchWeight: boolean
    increament: number
    contains: number
  }

export const roundMoney = (value: number) =>
  Math.round((value + Number.EPSILON) * 100) / 100

const decimal = (value: unknown) =>
  value === null || value === undefined || value === "" ? NaN : Number(value)

export const getUnit = (value: string | undefined) =>
  PRODUCT_UNITS.find((unit) => unit.value === value)

export function withCalculatedPrices<T extends SellingUnitPriceInput>(
  units: T[],
  catchWeight: boolean
): PricedSellingUnit<T>[] {
  const names = new Set<string>()
  return units.flatMap((unit) => {
    const name = unit.name.trim()
    const price = decimal(unit.price)
    const contains = decimal(unit.qtyPerUnit)
    const min = decimal(unit.minOrderQty ?? 1)
    const increment = decimal(unit.orderIncrement ?? 1)
    if (
      !name ||
      names.has(name) ||
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isFinite(contains) ||
      contains <= 0 ||
      !Number.isFinite(min) ||
      min <= 0 ||
      !Number.isFinite(increment) ||
      increment <= 0
    )
      return []
    names.add(name)
    const calculatedPrice = roundMoney(catchWeight ? price * contains : price)
    if (!Number.isSafeInteger(Math.round(calculatedPrice * 100))) return []
    return [
      {
        ...unit,
        name,
        displayLabel: unit.displayLabel || name,
        label: unit.displayLabel?.trim() || getUnit(name)?.label || name,
        min,
        price,
        calculatedPrice,
        catchWeight,
        increament: increment,
        contains,
      },
    ]
  })
}

export function isValidQuantity(quantity: number, minimum = 1, increment = 1) {
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

export function normalizeQuantity(
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
