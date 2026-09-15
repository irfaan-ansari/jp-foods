import { ProductSelectType, ProductSellUnitSelectType } from "@jp/db"

export type SellUnit = ProductSellUnitSelectType
export type Product = ProductSelectType & {
  sellUnits: SellUnit[]
}
export type Category = string
