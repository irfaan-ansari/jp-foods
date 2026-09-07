import { ProductSelectType, ProductSellUnitSelectType } from "@jp/db"

export type Product = ProductSelectType & {
  sellUnits: ProductSellUnitSelectType[]
}
export type Category = string
