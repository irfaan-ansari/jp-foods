import { roundMoney } from "./selling-units"
import { CalculationItem } from "./types"

export const DEFAULT_CHARGE = { type: "Fuel Charge", amount: 15 }
const WEIGHT_BASED = new Set(["per-unit", "catch-weight"])

export function calculateLineItem<T extends CalculationItem>(
  item: T,
  taxRate = 0
) {
  const weightBased = WEIGHT_BASED.has(item.pricingBasis)
  const rawUnitQuantity = item.quantity * item.packSize

  const unitQuantity = roundMoney(rawUnitQuantity)
  const subtotal = roundMoney(
    item.price * (weightBased ? rawUnitQuantity : item.quantity)
  )
  const taxAmount = item.isTaxable
    ? roundMoney((subtotal * (item.taxRate ?? taxRate)) / 100)
    : 0

  return {
    ...item,
    unitQuantity,
    subtotal,
    taxAmount,
    catchWeight: item.pricingBasis === "catch-weight",
    total: roundMoney(subtotal + taxAmount),
  }
}

export function calculateOrder<T extends CalculationItem>({
  items,
  taxRate = 0,
  charges,
}: {
  items: T[]
  taxRate?: number
  charges: number
}) {
  const calculatedItems = items.map((item) => calculateLineItem(item, taxRate))

  let subtotal = 0
  let taxableSubtotal = 0
  let nonTaxableSubtotal = 0
  let taxAmount = 0
  let lineItemQuantity = 0

  for (const item of calculatedItems) {
    subtotal += item.subtotal
    taxAmount += item.taxAmount
    lineItemQuantity += item.quantity

    if (item.isTaxable) taxableSubtotal += item.subtotal
    else nonTaxableSubtotal += item.subtotal
  }

  subtotal = roundMoney(subtotal)
  taxAmount = roundMoney(taxAmount)

  return {
    items: calculatedItems,
    totals: {
      lineItemCount: calculatedItems.length,
      lineItemQuantity,
      lineItemTotal: subtotal,
      subtotal,
      taxableSubtotal: roundMoney(taxableSubtotal),
      nonTaxableSubtotal: roundMoney(nonTaxableSubtotal),
      taxAmount,
      total: roundMoney(
        subtotal + taxAmount + (calculatedItems.length ? charges : 0)
      ),
    },
  }
}
