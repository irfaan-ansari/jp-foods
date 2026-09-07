import { ProductSelectType } from "@jp/db"

type LastOrder = {
  id: number
  quantity: string
  orderId: number
  createdAt: Date
}

export type Product = Omit<ProductSelectType, "basePrice"> & {
  price: string
  lastOrder?: LastOrder | undefined
}

export type Category = string
