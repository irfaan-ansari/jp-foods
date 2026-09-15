import { LineItemSelectType, OrderSelectType } from "@jp/db"

type LineItem = LineItemSelectType & {
  productId: number
  title: string
  price: string
  itemCode: string
  product: {
    sellUnits: {
      id: number
      name: string
      minQuantity: string
      orderIncreament: string
      inventoryPerUnit: string
    }[]
  } | null
}

export type Orders = OrderSelectType & {
  lineItemsCount: number
}
export type Order = OrderSelectType & {
  lineItems: LineItem[]
  estimateUrl: string
}
