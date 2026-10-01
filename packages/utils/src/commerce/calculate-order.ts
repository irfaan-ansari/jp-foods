import { roundMoney } from "./selling-units"
import { CalculationItem } from "./types"

export const DEFAULT_CHARGE = { type: "Fuel Charge", amount: 15 }

export function calculateLineItem<T extends CalculationItem>(
  item: T,
  taxRate = 0
) {
  const unitQuantity = roundMoney(
    item.catchWeight
      ? (item.actualUnitQuantity ?? item.quantity * item.qtyPerUnit)
      : item.quantity * item.qtyPerUnit
  )
  const calculatedPrice = roundMoney(
    item.catchWeight ? item.price * item.qtyPerUnit : item.price
  )
  const subtotal = roundMoney(
    item.price * (item.catchWeight ? unitQuantity : item.quantity)
  )
  const taxAmount = item.isTaxable
    ? roundMoney((subtotal * (item.taxRate ?? taxRate)) / 100)
    : 0

  return {
    ...item,
    calculatedPrice,
    unitQuantity,
    subtotal,
    taxAmount,
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
