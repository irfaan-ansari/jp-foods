import { OrderItem } from "./order-form.type"
import { Product } from "../product/product.type"
import { getSellingUnits } from "../product/product.utils"
import type { PricedSellingUnit } from "../product/product.type"
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

type OrderItemProduct = Partial<Omit<Product, "sellUnits">> & {
  sellUnits?: Product["sellUnits"] | null
}

export const toOrderItemInput = (
  product: OrderItemProduct,
  selectedUnit?: PricedSellingUnit
) => {
  const sellUnit = selectedUnit ?? getSellingUnits(product)[0]
  if (!sellUnit) throw new Error(`Product ${product.id} has no sell unit`)
  const { id, title, isTaxable, itemCode, image, categories } = product
  return {
    id: id!,
    title: title!,
    price: sellUnit.calculatedPrice,
    itemCode: itemCode!,
    unitName: sellUnit.name,
    baseQuantity: sellUnit.contains,
    unitConversion: sellUnit.contains,
    minQuantity: sellUnit.min,
    orderIncrement: sellUnit.increament,
    pricing: {
      label: sellUnit.label,
      uom: product.uom ?? "",
      catchWeight: sellUnit.catchWeight,
      contains: sellUnit.contains,
      price: sellUnit.price,
      calculatedPrice: sellUnit.calculatedPrice,
      min: sellUnit.min,
      increament: sellUnit.increament,
    },
    isTaxable: !!isTaxable,
    image: image ?? "",
    categories: categories ?? [],
    quantity: sellUnit.min,
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
  items.map((item) => ({
    productId: item.id,
    title: item.title,
    image: item.image,
    itemCode: item.itemCode,
    categories: item.categories,
    isTaxable: item.isTaxable,
    baseQuantity: String(item.quantity * item.baseQuantity),
    unitConversion: String(item.unitConversion),
    pricingSnapshot: item.pricing,
    unitName: item.unitName,
    price: item.price.toFixed(2),
    quantity: String(item.quantity),
    subtotal: item.subtotal.toFixed(2),
    taxAmount: item.taxAmount.toFixed(2),
    total: item.total.toFixed(2),
    taxRate: taxRate ?? "0",

    orderId,
    organizationId,
    teamId,
  }))
