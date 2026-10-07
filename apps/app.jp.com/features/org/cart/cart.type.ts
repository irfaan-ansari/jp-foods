import type z from "@jp/utils/validation"

import type { cartEventPayloadSchema, cartEventSchema } from "./cart.schema"

export type CartEventInput = z.input<typeof cartEventSchema>

export type CartEvent = z.infer<typeof cartEventPayloadSchema>

export type CartGroup = {
  user: {
    id: string
    name: string
    image: string
  }
  team: {
    id: string
    name: string
    logo: string
  }
  items: CartEvent["items"]
  status: CartEvent["status"]
  orderId?: number
  itemCount: number
  total: number
  updatedAt: string
}

export type CartActivity = CartGroup & {
  id: string
}
