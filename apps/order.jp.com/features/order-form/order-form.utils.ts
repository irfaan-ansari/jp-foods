import { OrderItem } from "./order-form.type"
import { Product } from "../product/product.type"
import { withCalculatedPrices } from "@jp/utils/commerce"
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

type OrderItemProduct = Partial<Omit<Product, "sellingUnits">> & {
  sellingUnits?: Product["sellingUnits"] | null
}

export const toOrderItemInput = (
  product: OrderItemProduct,
  selectedUnit?: PricedSellingUnit
) => {
  const sellingUnits = withCalculatedPrices(
    product.sellingUnits ?? [],
    !!product.catchWeight
  )
  const sellUnit = selectedUnit ?? sellingUnits[0]
  if (!sellUnit) throw new Error(`Product ${product.id} has no sell unit`)

  const { id, title, isTaxable, itemCode, image, categories } = product

  return {
    id: `${id}:${sellUnit.name}`,
    productId: id!,
    title: title!,
    itemCode: itemCode!,
    isTaxable: !!isTaxable,
    image: image ?? "",
    categories: categories ?? [],

    price: Number(sellUnit.price),
    quantity: Number(sellUnit.minOrderQty),
    uom: product.uom ?? "",
    unitName: sellUnit.name,
    unitLabel: sellUnit.displayLabel || sellUnit.name,
    minOrderQty: Number(sellUnit.minOrderQty),
    qtyPerUnit: Number(sellUnit.qtyPerUnit),
    orderIncrement: Number(sellUnit.orderIncrement),
    catchWeight: !!product.catchWeight,
    calculatedPrice: Number(sellUnit.calculatedPrice),
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
    productId: item.productId,
    title: item.title,
    image: item.image,
    itemCode: item.itemCode,
    categories: item.categories,
    isTaxable: item.isTaxable,

    price: item.price.toFixed(2),
    quantity: String(item.quantity),

    uom: item.uom ?? "",
    unitName: item.unitName,
    unitLabel: item.unitLabel,
    minOrderQty: item.minOrderQty,
    orderIncrement: item.orderIncrement,
    catchWeight: item.catchWeight,
    calculatedPrice: item.calculatedPrice.toFixed(2),

    unitQuantity: item.unitQuantity.toFixed(0),

    subtotal: item.subtotal.toFixed(2),
    taxAmount: item.taxAmount.toFixed(2),
    total: item.total.toFixed(2),
    taxRate: taxRate ?? "0",

    orderId,
    organizationId,
    teamId,
  }))
