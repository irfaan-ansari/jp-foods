import { OrderGuideSelectType, TeamSelectType } from "@jp/db"
import { Product } from "../product/product.type"

type OrderGuideProduct = Pick<
  Product,
  "id" | "title" | "itemCode" | "image" | "price" | "uom"
> & {
  unit: string
  position: number
}

export type OrderGuide = OrderGuideSelectType & {
  products: OrderGuideProduct[]
  team: Pick<TeamSelectType, "id" | "name" | "logo"> | null
}
