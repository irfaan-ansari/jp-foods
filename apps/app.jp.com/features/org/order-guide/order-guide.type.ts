import { OrderGuideSelectType, TeamSelectType } from "@jp/db"
import { Product } from "../product/product.type"

type OrderGuideProduct = Product & {
  position: number
}

export type OrderGuide = OrderGuideSelectType & {
  products: OrderGuideProduct[]
  team: Pick<TeamSelectType, "id" | "name" | "logo"> | null
}
