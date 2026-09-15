import type { OrderItemInput } from "./order-form.type"

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
    const lineSubtotal = item.price * item.quantity

    const taxAmount = item.isTaxable ? (lineSubtotal * taxRate) / 100 : 0

    const total = lineSubtotal + taxAmount

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

  const taxAmount = (taxableSubtotal * taxRate) / 100

  return {
    items: calculatedItems,
    totals: {
      lineItemCount: calculatedItems.length,
      lineItemQuantity,
      lineItemTotal,
      subtotal,
      taxableSubtotal,
      nonTaxableSubtotal,
      taxAmount,
      total: subtotal + taxAmount + charges,
    },
  }
}
