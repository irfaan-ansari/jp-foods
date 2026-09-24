import { MEASURE_UNITS } from "./product.const"
import type { Product } from "./product.type"
type RawSellUnit = {
  name: string
  label: string
  unitConversion: string // how many of THIS unit make one case (case = 1, 7 bags = 7)
  price: string
}

export type PricedSellingUnit = RawSellUnit & {
  label: string // stored label, else generated: "35lb", "5lb", "75lb avg"
  isDefault: boolean // the product's own sell unit (e.g. case)
  pricing: "fixed" | "per_uom"
  displayPrice: number // what the buyer reads: 3.2 (per lb) or 50 (per case)
  displayUnit: string // what displayPrice is per: "lb", "case"
  calculatedPrice: number // what the cart adds up (qty x this); estimate if weightIsEstimate
  weightLb: number | null
  weightIsEstimate: boolean
}

const round = (n: number, decimals: number) =>
  Number(Math.round(Number(`${n}e${decimals}`)) + `e-${decimals}`)

const money = (n: number) => round(n, 2)

const rateOf = (n: number) => round(n, 4)

const num = (v: string | number | null | undefined, fallback = 0) => {
  const n = Number(v)
  return Number.isFinite(n) && n !== 0 ? n : fallback
}

const fmt = (n: number) => String(round(n, 2))

const TIGHT_UNITS = new Set(["lb", "lbs", "oz", "kg", "g", "gal", "l", "ml"])

const withUnit = (n: number, unit: string) =>
  TIGHT_UNITS.has(unit.toLowerCase()) ? `${fmt(n)}${unit}` : `${fmt(n)} ${unit}`

export const getSellingUnits = (
  product: Pick<
    Product,
    | "price"
    | "uom"
    | "sellUnit"
    | "sellUnits"
    | "catchWeight"
    | "contains"
    | "weightLb"
    | "label"
  >
): PricedSellingUnit[] => {
  const uom = product.uom ?? ""
  const rawContains = num(product.contains, 1)
  const contains = num(product.contains, 1) // uom in ONE case, e.g. 35 lb
  const caseWeight = num(product.weightLb, 0) || null

  const defaultUnit: RawSellUnit = {
    name: product.sellUnit!,
    label: product.label!,
    unitConversion: "1",
    price: product.price!,
  }

  const units: RawSellUnit[] = [
    ...(defaultUnit ? [defaultUnit] : []),
    ...(product.sellUnits ?? []),
  ]

  return units.map((unit) => {
    const conv = num(unit.unitConversion, 1)

    const price = num(unit.price, 0)
    const weightLb = caseWeight ? round(caseWeight / conv, 4) : null
    const isDefault = unit === defaultUnit

    const describe = (qty: number) => {
      if (weightLb)
        return {
          value: qty * weightLb,
          text: withUnit(qty * weightLb, "lb"),
          measured: true,
        }
      if (rawContains && uom) {
        const v = (qty * rawContains) / conv
        return { value: v, text: withUnit(v, uom), measured: true }
      }
      return { value: qty, text: withUnit(qty, unit.name), measured: false }
    }

    const one = describe(1)
    const label =
      unit.label?.trim() ||
      (one.measured
        ? `${one.text}${product.catchWeight ? " avg" : ""}`
        : unit.name)

    const base = {
      ...unit,
      label,
      isDefault,
      weightLb,
    }

    if (product.catchWeight) {
      const calculated = money((price * contains) / conv)
      return {
        ...base,
        pricing: "per_uom",
        displayPrice: rateOf(price),
        displayUnit: uom || unit.name,
        calculatedPrice: calculated,
        weightIsEstimate: true,
        price: String(calculated),
      }
    }

    const amount = money(price / conv)
    return {
      ...base,
      pricing: "fixed",
      displayPrice: amount,
      displayUnit: unit.name,
      calculatedPrice: amount,
      weightIsEstimate: false,
      price: String(amount),
    }
  })
}
export const getUnit = (value: string | undefined) => {
  if (!value) return null
  return MEASURE_UNITS.find((u) => u.value === value)
}
