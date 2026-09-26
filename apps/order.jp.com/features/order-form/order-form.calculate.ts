import type { OrderItemInput } from "./order-form.type"
import { roundMoney } from "@jp/utils/commerce"

export function calculateOrder({
  items,
  taxRate = 0,
  charges = 0,
}: {
  items: OrderItemInput[]
  taxRate?: number
  charges?: number
}) {
  let subtotal = 0
  let taxableSubtotal = 0
  let nonTaxableSubtotal = 0
  let lineItemQuantity = 0
  let lineItemTotal = 0

  const calculatedItems = items.map((item) => {
    const lineSubtotal = roundMoney(item.price * item.quantity)

    const taxAmount = item.isTaxable ? roundMoney((lineSubtotal * taxRate) / 100) : 0

    const total = roundMoney(lineSubtotal + taxAmount)

    subtotal += lineSubtotal
    lineItemQuantity += item.quantity
    lineItemTotal += lineSubtotal

    if (item.isTaxable) {
      taxableSubtotal += lineSubtotal
    } else {
      nonTaxableSubtotal += lineSubtotal
    }

    return {
      ...item,
      subtotal: lineSubtotal,
      taxAmount,
      total,
    }
  })

  const taxAmount = roundMoney(calculatedItems.reduce((sum, item) => sum + item.taxAmount, 0))

  const appliedCharges = calculatedItems.length > 0 ? charges : 0

  return {
    items: calculatedItems,
    totals: {
      lineItemCount: calculatedItems.length,
      lineItemQuantity,
      lineItemTotal,
      subtotal: roundMoney(subtotal),
      taxableSubtotal: roundMoney(taxableSubtotal),
      nonTaxableSubtotal: roundMoney(nonTaxableSubtotal),
      taxAmount,
      total: roundMoney(subtotal + taxAmount + appliedCharges),
    },
  }
}
