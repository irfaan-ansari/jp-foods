import { OrderGuideSelectType, ProductSelectType, TeamSelectType } from "@jp/db"

type Product = Pick<
  ProductSelectType,
  "id" | "title" | "basePrice" | "itemCode" | "image"
>

type OrderGuideProduct = Product & {
  position: number
}

export type OrderGuide = OrderGuideSelectType & {
  products: OrderGuideProduct[]
  team: Pick<TeamSelectType, "id" | "name" | "logo"> | null
}
