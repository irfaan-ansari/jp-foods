import assert from "node:assert/strict"
import { test } from "node:test"

import { createProductPriceResolver } from "./price-level"
import { getSellingUnits } from "./selling-units"

const product = {
  id: 1,
  title: "Test product",
  catchWeight: false,
  sellingUnits: [
    {
      name: "case",
      displayLabel: "Case",
      price: "20",
      qtyPerUnit: "10",
      isDefault: true,
    },
    {
      name: "each",
      displayLabel: "Each",
      price: "3",
      qtyPerUnit: "1",
      isDefault: false,
    },
  ],
}
const config = {
  status: "active",
  appliesTo: "all",
  adjustmentType: "fixed",
  adjustmentValue: "2",
  priceLevelItem: [{ productId: 1, adjustmentValue: "-1" }],
}

test("fixed and percentage adjustments apply to every unit without mutating the product", () => {
  const original = structuredClone(product)
  for (const [appliesTo, adjustmentType, expected] of [
    ["all", "fixed", ["22", "5"]],
    ["all", "percentage", ["20.4", "3.06"]],
    ["per_item", "fixed", ["19", "2"]],
    ["per_item", "percentage", ["19.8", "2.97"]],
  ] as const) {
    const result = createProductPriceResolver({
      ...config,
      appliesTo,
      adjustmentType,
    })(product)
    assert.deepEqual(
      result.sellingUnits.map((unit) => unit.price),
      expected
    )
    assert.equal(result.title, product.title)
    assert.equal(result.sellingUnits[0]?.isDefault, true)
  }
  assert.deepEqual(product, original)
})

test("missing, inactive, unmatched, and invalid adjustments preserve base prices", () => {
  for (const value of [
    undefined,
    null,
    { ...config, status: "inactive" },
    { ...config, appliesTo: "per_item", priceLevelItem: [] },
    { ...config, adjustmentValue: "invalid" },
    { ...config, adjustmentValue: "" },
  ]) {
    assert.equal(createProductPriceResolver(value)(product), product)
  }
  assert.equal(
    createProductPriceResolver(config)({ id: 1, sellingUnits: null })
      .sellingUnits,
    null
  )
})

test("discounts stop at zero and decimal prices round consistently", () => {
  const resolve = createProductPriceResolver({
    ...config,
    adjustmentValue: "-100",
  })
  assert.deepEqual(
    resolve(product).sellingUnits.map((unit) => unit.price),
    ["0", "0"]
  )
  const result = createProductPriceResolver({
    ...config,
    adjustmentValue: "0.1",
  })({
    id: 1,
    sellingUnits: [{ price: "0.2" }],
  })
  assert.equal(result.sellingUnits[0]?.price, "0.3")
})

test("resolved units use per-unit prices and multiply only catch-weight prices", () => {
  const resolve = createProductPriceResolver(config)
  const fixed = getSellingUnits(resolve(product))
  assert.deepEqual(
    fixed.map((unit) => unit.calculatedPrice),
    [22, 5]
  )
  const weighted = getSellingUnits(resolve({ ...product, catchWeight: true }))
  assert.deepEqual(
    weighted.map((unit) => unit.calculatedPrice),
    [220, 5]
  )
  assert.deepEqual(
    weighted.map((unit) => unit.contains),
    [10, 1]
  )
})

test("selling units retain quantity rules and reject invalid entries", () => {
  const units = getSellingUnits({
    sellingUnits: [
      { ...product.sellingUnits[0]!, minOrderQty: "2", orderIncrement: "0.5" },
      { ...product.sellingUnits[1]!, qtyPerUnit: "0" },
    ],
  })
  assert.equal(units.length, 1)
  assert.equal(units[0]?.min, 2)
  assert.equal(units[0]?.increament, 0.5)
})
