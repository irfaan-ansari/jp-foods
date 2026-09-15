import assert from "node:assert/strict"
import { test } from "node:test"

import { productFormSchema, productFormValues } from "./product.schema.ts"

test("sell-unit validation preserves fractional quantities and rejects zero increments", () => {
  const product = {
    ...productFormValues,
    title: "Produce",
    itemCode: "P-1",
    sellUnits: [
      {
        name: "lb",
        inventoryPerUnit: "1",
        price: "1.25",
        minQuantity: "0.5",
        orderIncreament: "0.25",
        isBaseUnit: true,
      },
    ],
  }

  assert.equal(productFormSchema.parse(product).sellUnits[0].price, "1.25")
  assert.equal(productFormSchema.parse(product).sellUnits[0].minQuantity, "0.5")
  assert.equal(
    productFormSchema.safeParse({
      ...product,
      sellUnits: [{ ...product.sellUnits[0], orderIncreament: "0" }],
    }).success,
    false
  )
})
