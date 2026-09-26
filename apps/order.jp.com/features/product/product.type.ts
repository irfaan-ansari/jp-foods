import type { ProductSelectType } from "@jp/db"
export type { SellingUnit as PricedSellingUnit } from "@jp/utils/commerce"

export type SellUnit = NonNullable<ProductSelectType["sellingUnits"]>[number]
export type Product = ProductSelectType & {
  lastOrder?: {
    id: number
    quantity: string
    unitName: string | null
    orderId: number | null
    createdAt: Date | string | null
  }
}
export type Category = string
