import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

import { calculateOrder } from "./order-form.calculate"
import type { OrderForm, OrderItem, OrderItemInput } from "./order-form.type"

const CART_KEY = "CART"
const CART_VERSION = 5

export const DEFAULT_CHARGE = {
  type: "Fuel Charge",
  amount: 15,
}

const initialOrder = (): OrderForm => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")

  return {
    subtotal: 0,
    taxAmount: 0,
    total: 0,
    lineItemCount: 0,
    lineItemQuantity: 0,
    taxableSubtotal: 0,
    nonTaxableSubtotal: 0,

    charges: { ...DEFAULT_CHARGE },
    taxRule: { name: "", rate: 0 },

    po: "",
    deliveryDate: `${year}-${month}-${day}`,
    deliveryWindow: "Anytime",
    deliveryInstruction: "",

    items: [],
  }
}

interface OrderStore {
  order: OrderForm
  ready: boolean

  update: (values: Partial<OrderForm>) => void
  addItem: (item: OrderItemInput) => void
  updateItem: (item: OrderItemInput) => void
  removeItem: (id: string) => void
  getItem: (id: string) => OrderItem | undefined

  clear: () => void
}

function stripDerived(items: OrderItem[]): OrderItemInput[] {
  return items.map(({ subtotal, taxAmount, total, ...item }) => item)
}

function recalculate(
  order: OrderForm,
  items: OrderItemInput[] = stripDerived(order.items)
): OrderForm {
  const calculated = calculateOrder({
    items,
    taxRate: order.taxRule?.rate,
    charges: order.charges.amount,
  })

  return {
    ...order,
    ...calculated.totals,
    items: calculated.items,
  }
}

export const useOrderFormStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      order: initialOrder(),
      ready: false,

      update: (values) =>
        set((state) => {
          if (!state.ready) return state

          return {
            order: recalculate({ ...state.order, ...values }),
          }
        }),

      addItem: (item) => get().updateItem(item),

      updateItem: (item) =>
        set((state) => {
          const items = stripDerived(state.order.items)

          const next: OrderItemInput = { ...item, quantity: item.quantity }
          const index = items.findIndex((current) => current.id === item.id)

          if (index === -1) {
            items.push(next)
          } else {
            items[index] = next
          }

          return {
            order: recalculate(state.order, items),
          }
        }),

      removeItem: (id) =>
        set((state) => {
          if (!state.ready) return state

          return {
            order: recalculate(
              state.order,
              stripDerived(state.order.items).filter((item) => item.id !== id)
            ),
          }
        }),

      getItem: (id) => get().order.items.find((item) => item.id === id),

      clear: () =>
        set((state) => {
          if (!state.ready) return state

          return {
            order: recalculate({
              ...initialOrder(),
              teamId: state.order.teamId,
              taxRule: state.order.taxRule,
            }),
          }
        }),
    }),
    {
      name: CART_KEY,
      version: CART_VERSION,
      skipHydration: true,
      partialize: (state) => ({ order: state.order }),
      storage: createJSONStorage(() => localStorage),
    }
  )
)
