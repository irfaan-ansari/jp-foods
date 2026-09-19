import { ProductSelectType } from "@jp/db"

type LastOrder = {
  id: number
  quantity: string
  unitName: string | null
  orderId: number
  createdAt: Date
}

export type SellUnit = NonNullable<ProductSelectType["sellUnits"]>[number] & {
  price?: string
}

export type PricedSellingUnit = NonNullable<
  ProductSelectType["sellUnits"]
>[number] & {
  price: string
}

export type Product = Omit<ProductSelectType, "sellUnits"> & {
  sellUnits: SellUnit[]
  lastOrder?: LastOrder | undefined
}

export type Category = string
