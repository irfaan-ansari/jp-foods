import type { ProductSelectType } from "@jp/db"
export type { SellingUnit as PricedSellingUnit } from "@jp/utils/commerce"

export type Product = ProductSelectType
export type SellingUnit = NonNullable<Product["sellingUnits"]>[number]
export type Category = string
