import {
  PriceLevelItemSelectType,
  PriceLevelSelectType,
  ProductSelectType,
} from "@jp/db"

type SellUnit = {
  id: number
  name: string
  basePrice: string
  price: string
}
type PriceLeveItem = Pick<
  ProductSelectType,
  "id" | "title" | "image" | "itemCode"
> & {
  sellUnits: SellUnit[]
}

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
