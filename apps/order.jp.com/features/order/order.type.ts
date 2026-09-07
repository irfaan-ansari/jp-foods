import { LineItemSelectType, OrderSelectType } from "@jp/db"

type LineItem = LineItemSelectType & {
  productId: number
  title: string
  price: string
  itemCode: string
}

export type Orders = OrderSelectType & {
  lineItemsCount: number
}
export type Order = OrderSelectType & {
  lineItems: LineItem[]
}
