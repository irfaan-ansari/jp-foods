import type {
  invoice,
  invoiceLineItem,
  LineItemSelectType,
  OrderSelectType,
  OrganizationSelectType,
  TeamSelectType,
} from "@jp/db"

type Party = NonNullable<typeof invoice.$inferInsert.billTo>
type SourceOrder = OrderSelectType & {
  organization: OrganizationSelectType | null
  team: TeamSelectType | null
  lineItems: LineItemSelectType[]
}

export function createInvoiceSnapshot(source: SourceOrder) {
  if (!source.organization) throw new Error("Order has no organization")
  const org = source.organization
  const address = (source.team?.metadata ?? {}) as Record<string, string>
  const orgAddress = (org.metadata ? JSON.parse(org.metadata) : {}) as Record<
    string,
    string
  >
  const billTo: Party = {
    name: source.team?.name ?? "Deleted customer",
    email: source.team?.email,
    phone: source.team?.phoneNumber,
    street: address.street ?? "",
    city: address.city ?? "",
    state: address.state ?? "",
    zip: address.zipcode ?? address.zip ?? "",
  }
  const header: typeof invoice.$inferInsert = {
    organizationId: org.id,
    teamId: source.teamId,
    orderId: source.id,
    number: `INV-${String(source.id).padStart(6, "0")}`,
    status: "processing",
    billFrom: {
      name: org.name,
      email: org.email,
      phone: org.phoneNumber,
      street: orgAddress.street ?? "",
      city: orgAddress.city ?? "",
      state: orgAddress.state ?? "",
      zip: orgAddress.zipcode ?? orgAddress.zip ?? "",
    },
    billTo,
    shipTo: source.shippingAddress?.street
      ? { ...billTo, ...source.shippingAddress }
      : billTo,
    po: source.po,
    charges: source.charges
      ? [{ type: source.charges.type, amount: Number(source.charges.amount) }]
      : [],
    chargesTotal: source.charges?.amount ?? "0",
    tax: {
      type: source.taxName ?? "Tax",
      rate: Number(source.taxRate ?? 0),
      amount: Number(source.taxAmount),
    },
    subtotal: source.subtotal,
    discount: source.discount,
    taxTotal: source.taxAmount,
    total: source.total,
    notes: source.notes,
  }
  const lines: Omit<typeof invoiceLineItem.$inferInsert, "invoiceId">[] =
    source.lineItems.map((item, index) => ({
      orderLineItemId: item.id,
      productId: item.productId,
      itemCode: item.itemCode,
      title: item.title ?? "Item",
      unitName: item.unitLabel || item.unitName,
      unitQuantity: item.unitQuantity,
      quantity: item.quantity,
      catchWeight: !!item.catchWeight,
      uom: item.uom,
      price: item.price,
      subtotal: item.subtotal ?? "0",
      isTaxable: !!item.isTaxable,
      taxRate: item.taxRate ?? "0",
      taxAmount: item.taxAmount ?? "0",
      total: item.total ?? "0",
      sortOrder: index,
    }))
  return { header, lines }
}
