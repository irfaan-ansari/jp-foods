import { OrderItem } from "./order-form.type"
import { Product } from "../product/product.type"
import { ServerMinimalistic, Widget } from "@solar-icons/react"
import { ClipboardList, Package } from "lucide-react"

export const LAYOUT_OPTIONS = [
  { label: "List", value: "list", icon: ServerMinimalistic },
  { label: "Grid", value: "grid", icon: Widget },
]

export type Layout = (typeof LAYOUT_OPTIONS)[number]["value"]

export const ORDER_NAV = [
  { label: "All Products", href: "/create/all", icon: Package },
  { label: "Order Guide", href: "/create/guides", icon: ClipboardList },
]

export const toOrderItemInputs = (product: Partial<Product>[]) => {
  return product.map((p) => toOrderItemInput(p))
}

export const toOrderItemInput = (product: Partial<Product>) => {
  const {
    id,
    title,
    price,
    pack,
    unitSize,
    isTaxable,
    itemCode,
    image,
    categories,
    unit,
    ...rest
  } = product
  return {
    id: id!,
    title: title!,
    price: Number(price),
    pack: Number(pack ?? 1),
    itemCode: itemCode!,
    unit: unit ?? "",
    unitSize: Number(unitSize ?? 1),
    isTaxable: !!isTaxable,
    image: image ?? "",
    categories: categories ?? [],
    quantity: 1,
  }
}

export const toInsertOrder = ({
  data,
  totals,
  taxRule,
  organizationId,
  teamId,
  userId,
}: {
  data: {
    po?: string | null
    deliveryDate: string
    deliveryWindow?: string | null
    deliveryInstruction?: string | null
  }
  totals: {
    lineItemCount: number
    lineItemQuantity: number
    lineItemTotal: number
    subtotal: number
    taxableSubtotal: number
    nonTaxableSubtotal: number
    taxAmount: number
    total: number
  }
  taxRule?: {
    name: string
    rate: string
  } | null
  organizationId: string
  teamId: string
  userId: string
}) => {
  return {
    po: data.po,
    deliveryDate: data.deliveryDate,
    deliveryWindow: data.deliveryWindow,
    deliveryInstruction: data.deliveryInstruction,
    lineItemCount: String(totals.lineItemCount),
    lineItemQuantity: String(totals.lineItemQuantity),
    lineItemTotal: totals.lineItemTotal.toFixed(2),
    subtotal: totals.subtotal.toFixed(2),
    taxableSubtotal: totals.taxableSubtotal.toFixed(2),
    nonTaxableSubtotal: totals.nonTaxableSubtotal.toFixed(2),
    taxAmount: totals.taxAmount.toFixed(2),
    total: totals.total.toFixed(2),

    taxName: taxRule?.name,
    charges: { type: "Fuel Charge", amount: "15" },
    taxRate: String(taxRule?.rate ?? 0),

    notes: "",
    shippingAddress: {
      zip: "",
      city: "",
      state: "",
      street: "",
    },

    status: "in_progress",
    invoiceStatus: "pending",
    organizationId,
    teamId,
    userId,
  }
}

export const toInsertLineItems = ({
  items,
  orderId,
  organizationId,
  teamId,
  taxRate,
}: {
  items: OrderItem[]
  orderId: number
  organizationId: string
  teamId: string
  taxRate: string | undefined
}) =>
  items.map(
    ({
      id,
      subtotal,
      price,
      pack,
      unitSize,
      total,
      taxAmount,
      quantity,
      ...item
    }) => ({
      ...item,
      productId: id,
      price: price.toFixed(2),
      quantity: String(quantity),
      subtotal: subtotal.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      total: total.toFixed(2),
      taxRate: taxRate ?? "0",
      pack: String(pack),
      unitSize: String(unitSize),

      orderId,
      organizationId,
      teamId,
    })
  )
