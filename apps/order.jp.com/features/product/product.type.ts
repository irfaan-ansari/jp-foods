import type { ProductSelectType } from "@jp/db"
import { SellUnit } from "@jp/utils/commerce"



export type Product = ProductSelectType &  {
  sellUnits: SellUnit[]
  lastOrder?: {
    id: number
    quantity: string
    unit: string | null
    orderId: number | null
    createdAt: Date | string | null
  }
}
export type Category = string
