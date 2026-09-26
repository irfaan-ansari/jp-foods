import { PRODUCT_UNITS } from "./units"

export type SellingUnit = {
  name: string
  label: string
  min: number
  price: number
  calculatedPrice: number
  catchWeight: boolean
  increament: number
  contains: number
}

export type ProductPricing = {
  catchWeight?: boolean | null
  sellingUnits?:
    | {
        name: string
        displayLabel: string
        price: string | number
        qtyPerUnit: string | number
        minOrderQty?: string | number
        orderIncrement?: string | number
      }[]
    | null
}

export const roundMoney = (value: number) =>
  Math.round((value + Number.EPSILON) * 100) / 100

const decimal = (value: unknown) =>
  value === null || value === undefined || value === "" ? NaN : Number(value)

export const getUnit = (value: string | undefined) =>
  PRODUCT_UNITS.find((unit) => unit.value === value)

/** Prices are per selling unit for fixed products, and per UOM for catch weight.
 * qtyPerUnit is the quantity of the base UOM in a selling unit. Invalid entries are
 * unavailable, rather than silently becoming free or incorrectly sized items.
 */
export function getSellingUnits(product: ProductPricing): SellingUnit[] {
  const units = product.sellingUnits ?? []
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
    const catchWeight = !!product.catchWeight
    const calculatedPrice = roundMoney(catchWeight ? price * contains : price)
    if (
      !Number.isFinite(contains) ||
      !Number.isSafeInteger(Math.round(calculatedPrice * 100))
    )
      return []
    return [
      {
        name,
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
