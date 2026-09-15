import { ProductSelectType, ProductSellUnitSelectType } from "@jp/db"

type LastOrder = {
  id: number
  quantity: string
  unitName: string | null
  orderId: number
  createdAt: Date
}

export type Product = ProductSelectType & {
  sellUnits: ProductSellUnitSelectType[]
  lastOrder?: LastOrder | undefined
}

export type Category = string
