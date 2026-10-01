import assert from "node:assert/strict"
import { test } from "node:test"
import { calculateLineItem, calculateOrder } from "./calculate-order"

const item = {
  price: 3,
  quantity: 2,
  qtyPerUnit: 10,
  catchWeight: true,
  isTaxable: true,
}

test("estimates weight and preserves item metadata", () => {
  const result = calculateOrder({
    items: [{ ...item, id: "product:case", title: "Product" }],
    taxRate: 10,
    charges: 15,
  })
  assert.equal(result.items[0]?.id, "product:case")
  assert.equal(result.items[0]?.unitQuantity, 20)
  assert.equal(result.items[0]?.calculatedPrice, 30)
  assert.deepEqual(result.totals, {
    lineItemCount: 1,
    lineItemQuantity: 2,
    lineItemTotal: 60,
    subtotal: 60,
    taxableSubtotal: 60,
    nonTaxableSubtotal: 0,
    taxAmount: 6,
    total: 81,
  })
})

test("completion uses actual weight and the saved line tax rate", () => {
  const result = calculateOrder({
    items: [{ ...item, actualUnitQuantity: 18.5, taxRate: 5 }],
    taxRate: 20,
    charges: 7,
  })
  assert.equal(result.items[0]?.unitQuantity, 18.5)
  assert.equal(result.totals.subtotal, 55.5)
  assert.equal(result.totals.taxAmount, 2.78)
  assert.equal(result.totals.total, 65.28)
})

test("fixed-price and exempt lines keep their pricing and tax rules", () => {
  const result = calculateOrder({
    items: [
      { ...item, catchWeight: false, actualUnitQuantity: 100 },
      { ...item, isTaxable: false, taxRate: 10 },
    ],
    taxRate: 10,
    charges: 0,
  })
  assert.equal(result.items[0]?.unitQuantity, 20)
  assert.equal(result.items[0]?.subtotal, 6)
  assert.equal(result.items[1]?.taxAmount, 0)
  assert.equal(result.totals.taxableSubtotal, 6)
  assert.equal(result.totals.nonTaxableSubtotal, 60)
  assert.equal(result.totals.total, 66.6)
})

test("recalculates estimated weight instead of reusing derived form values", () => {
  const original = calculateLineItem(item)
  const updated = calculateLineItem({ ...original, quantity: 3 })
  assert.equal(original.unitQuantity, 20)
  assert.equal(updated.unitQuantity, 30)
  assert.equal(updated.subtotal, 90)
})

test("creation and completion agree at the same persisted weight", () => {
  const estimated = calculateLineItem(
    {
      ...item,
      price: 1.01,
      qtyPerUnit: 3,
      quantity: 0.335,
    },
    8.25
  )
  const completed = calculateLineItem(
    {
      ...item,
      price: 1.01,
      qtyPerUnit: 3,
      quantity: 0.335,
      actualUnitQuantity: estimated.unitQuantity,
    },
    8.25
  )
  assert.equal(estimated.unitQuantity, 1.01)
  assert.equal(estimated.subtotal, 1.02)
  assert.equal(completed.subtotal, estimated.subtotal)
  assert.equal(completed.total, estimated.total)
})

test("does not add charges to an empty order", () => {
  const result = calculateOrder({ items: [], charges: 15 })
  assert.equal(result.totals.total, 0)
  assert.equal(result.totals.lineItemCount, 0)
})
