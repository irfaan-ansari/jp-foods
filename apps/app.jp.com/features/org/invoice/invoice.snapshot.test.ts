import assert from "node:assert/strict"
import { test } from "node:test"
import { createInvoiceSnapshot } from "./invoice.snapshot"

test("snapshots saved amounts and fractional weights without repricing", () => {
  const source = {
    id: 123,
    teamId: "team",
    po: "PO-1",
    notes: "Deliver to rear door",
    subtotal: "65.63",
    taxAmount: "4.92",
    taxRate: "7.5",
    taxName: "Sales tax",
    discount: "0.00",
    total: "85.55",
    charges: { type: "Fuel", amount: "15" },
    shippingAddress: { street: "", city: "", state: "", zip: "" },
    organization: {
      id: "org",
      name: "Seller",
      email: "seller@example.com",
      phoneNumber: "555",
      metadata: '{"street":"Warehouse"}',
    },
    team: {
      name: "Buyer",
      email: "buyer@example.com",
      phoneNumber: "555",
      metadata: { street: "Shop", zipcode: "12345" },
    },
    lineItems: [
      {
        id: 7,
        productId: 9,
        itemCode: "SKU",
        title: "Produce",
        unitName: "Case",
        unitLabel: "Case",
        unitQuantity: "18.75",
        quantity: "2.0000",
        catchWeight: true,
        uom: "lb",
        price: "3.50",
        subtotal: "65.63",
        isTaxable: true,
        taxRate: "7.5000",
        taxAmount: "4.92",
        total: "70.55",
      },
    ],
  } as unknown as Parameters<typeof createInvoiceSnapshot>[0]
  const { header, lines } = createInvoiceSnapshot(source)
  assert.equal(header.number, "INV-000123")
  assert.equal(header.total, source.total)
  assert.equal(header.status, "processing")
  assert.equal(header.billFrom?.street, "Warehouse")
  assert.equal(header.billTo?.zip, "12345")
  assert.deepEqual(header.shipTo, header.billTo)
  assert.equal(lines[0]?.unitQuantity, "18.75")
  assert.equal(lines[0]?.price, "3.50")
  assert.equal(lines[0]?.taxRate, "7.5000")
  assert.equal(lines[0]?.orderLineItemId, 7)

  source.team!.name = "Renamed customer"
  source.lineItems[0]!.title = "Renamed product"
  assert.equal(header.billTo?.name, "Buyer")
  assert.equal(lines[0]?.title, "Produce")

  source.shippingAddress = {
    street: "Delivery depot",
    city: "Miami",
    state: "FL",
    zip: "33101",
  }
  assert.equal(
    createInvoiceSnapshot(source).header.shipTo?.street,
    "Delivery depot"
  )
})
