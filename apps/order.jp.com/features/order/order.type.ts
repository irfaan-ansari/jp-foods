import { LineItemSelectType, OrderSelectType, ProductSelectType } from "@jp/db"

type LineItem = LineItemSelectType & {
  productId: number
  title: string
  price: string
  itemCode: string
  product: ProductSelectType | null
}

export type Orders = OrderSelectType & {
  lineItemsCount: number
}
export type Order = OrderSelectType & {
  lineItems: LineItem[]
  estimateUrl: string
}
