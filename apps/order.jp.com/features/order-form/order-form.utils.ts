import { ServerMinimalistic, Widget } from "@solar-icons/react"
import { Product } from "../product/product.type"

export const LAYOUT_OPTIONS = [
  { label: "List", value: "list", icon: ServerMinimalistic },
  { label: "Grid", value: "grid", icon: Widget },
]

export type Layout = (typeof LAYOUT_OPTIONS)[number]["value"]

export const ORDER_NAV = [
  { label: "All Products", href: "/create/all" },
  { label: "Order Guide", href: "/create/guides" },
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
