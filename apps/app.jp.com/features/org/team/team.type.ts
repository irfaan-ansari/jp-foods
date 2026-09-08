import { OrderGuideSelectType, TeamSelectType, UserSelectType } from "@jp/db"
import { Product } from "../product/product.type"

export type Team = TeamSelectType & {
  salesRep: Pick<UserSelectType, "id" | "name" | "image">
  teamMembers: {
    id: string
    userId: string
    name: string
    image: string
  }[]
}

export type TeamAnalytics = {
  range: string

  summary: {
    totalOrders: number
    activeOrders: number
    totalSpend: number
    averageOrderValue: number
  }

  topProducts: {
    id: string
    title: string
    itemCode: string | null
    image: string | null
    quantity: number
    total: number
  }[]

  topCategories: {
    name: string
    quantity: number
    total: number
  }[]

  recentOrders: {
    id: string
    orderNumber: string
    status: string
    total: string
    createdAt: Date
  }[]

  orderGuides: OrderGuideSelectType &
    {
      products: Product[]
      productCount: number
    }[]
}
