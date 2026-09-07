import { PromotionSelectType } from "@jp/db"
import { Product } from "../product/product.type"

export type Promotion = Omit<PromotionSelectType, "productIds"> & {
  products: Product[]
}
