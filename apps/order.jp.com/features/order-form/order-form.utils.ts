import { OrderItem } from "./order-form.type"
import { Product } from "../product/product.type"
import type { PricedSellingUnit } from "@jp/utils/commerce"
import { ServerMinimalistic, Widget } from "@solar-icons/react"
import { ClipboardList, Package } from "lucide-react"
import { SellUnit } from "@jp/utils/commerce"

export const LAYOUT_OPTIONS = [
  { label: "List", value: "list", icon: ServerMinimalistic },
  { label: "Grid", value: "grid", icon: Widget },
]

export type Layout = (typeof LAYOUT_OPTIONS)[number]["value"]

export const ORDER_NAV = [
  { label: "All Products", href: "/create/all", icon: Package },
  { label: "Order Guide", href: "/create/guides", icon: ClipboardList },
]

export const toOrderItemInputs = (product: Product[]) => {
  return product.map((p) => toOrderItemInput(p))
}

type OrderItemProduct = Partial<Omit<Product, "sellingUnits">> & {
  sellUnits: SellUnit[]
}

export const toOrderItemInput = (
  product: OrderItemProduct,
  selectedUnit?: PricedSellingUnit
) => {
  const sellUnit = selectedUnit ?? product.sellUnits[0]
  if (!sellUnit) throw new Error(`Product ${product.id} has no sell unit`)

  const { id, title, isTaxable, itemCode, image, categories, type, location } =
    product

  return {
    id: `${id}:${sellUnit.name}`,
    productId: id!,
    title: title!,
    itemCode: itemCode!,
    type: type ?? "",
    location: location ?? "",
    isTaxable: !!isTaxable,
    image: image ?? "",
    categories: categories ?? [],

    price: Number(sellUnit.price),
    pricingBasis: product.pricingBasis ?? "fixed",
    quantity: 1,
    stockUOM: product.stockUOM ?? "",
    unit: sellUnit.name,
    displayLabel: sellUnit.displayLabel || sellUnit.name,
    packSize: Number(sellUnit.packSize),
    unitQuantity: Number(sellUnit.packSize),
    catchWeight: !!product.catchWeight,
  }
}

export const toInsertOrder = ({
  data,
  totals,
  charges,
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
  charges: { type: string; amount: number }
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
    lineItemCount: totals.lineItemCount,
    lineItemQuantity: String(totals.lineItemQuantity),
    lineItemTotal: totals.lineItemTotal.toFixed(2),
    subtotal: totals.subtotal.toFixed(2),
    taxableSubtotal: totals.taxableSubtotal.toFixed(2),
    nonTaxableSubtotal: totals.nonTaxableSubtotal.toFixed(2),
    taxAmount: totals.taxAmount.toFixed(2),
    total: totals.total.toFixed(2),

    taxName: taxRule?.name,
    charges: { type: charges.type, amount: charges.amount.toFixed(2) },
    taxRate: String(taxRule?.rate ?? 0),

    notes: "",
    shippingAddress: {
      zip: "",
      city: "",
      state: "",
      street: "",
    },
    status: "placed",
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
  items.map((item) => ({
    productId: item.productId,
    title: item.title,
    image: item.image,
    itemCode: item.itemCode,
    categories: item.categories,
    type: item.type,
    location: item.location,
    isTaxable: item.isTaxable,

    quantity: item.quantity,
    price: item.price.toFixed(2),
    stockUOM: item.stockUOM ?? "",
    unit: item.unit,
    displayLabel: item.displayLabel,
    packSize: String(item.packSize),
    catchWeight: item.catchWeight,
    pricingBasis: item.pricingBasis,

    unitQuantity: String(item.unitQuantity),
    subtotal: item.subtotal.toFixed(2),
    taxAmount: item.taxAmount.toFixed(2),
    total: item.total.toFixed(2),
    taxRate: taxRate ?? "0",

    orderId,
    organizationId,
    teamId,
  }))
