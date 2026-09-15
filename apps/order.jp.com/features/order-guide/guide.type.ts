import { OrderGuideSelectType } from "@jp/db"
import { Product } from "../product/product.type"

type LastOrder = {
  id: number
  quantity: string
  unitName: string | null
  orderId: number
  createdAt: Date
}

export type GuideItem = Product & {
  itemId: number
  lastOrder?: LastOrder | undefined
}

export type Guide = OrderGuideSelectType & {
  items: GuideItem[]
}
