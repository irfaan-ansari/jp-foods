import type { ProductSelectType } from "@jp/db"

export type Product = ProductSelectType
export type SellingUnit = NonNullable<Product["sellUnits"]>[number]
export type PricedSellingUnit = SellingUnit & { price: string }
export type Category = string
