import {
  PriceLevelItemSelectType,
  PriceLevelSelectType,
  ProductSelectType,
} from "@jp/db"

type PriceLeveItem = Pick<
  ProductSelectType,
  "id" | "title" | "image" | "itemCode" | "basePrice"
> & { price: string }

export type PriceLevel = PriceLevelSelectType & {
  customerCount: number
  productCount: number
  products: PriceLeveItem[]
}

export type PriceLevelBadge = {
  appliesTo: string
  adjustmentType: string
  adjustmentValue: number | string
  productCount?: number
}

export type PriceLevelItem = PriceLevelItemSelectType
