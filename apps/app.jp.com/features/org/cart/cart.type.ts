import type z from "@jp/utils/validation"

import type {
  cartActivitySchema,
  cartItemSchema,
  cartEventPayloadSchema,
  cartEventSchema,
} from "./cart.schema"

export type CartEventInput = z.input<typeof cartEventSchema>

export type CartEvent = z.infer<typeof cartEventPayloadSchema>
export type CartItem = z.infer<typeof cartItemSchema>
export type CartPublication = CartEvent & { activity: CartActivity[] }

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
  status: "active" | "submitting" | "placed"
  orderId?: number
  itemCount: number
  total: number
  updatedAt: string
}

export type CartActivity = z.infer<typeof cartActivitySchema>
