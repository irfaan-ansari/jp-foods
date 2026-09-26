import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { normalizeQuantity, isValidQuantity } from "@jp/utils/commerce"
import { calculateOrder } from "./order-form.calculate"
import type { OrderForm, OrderItem, OrderItemInput } from "./order-form.type"

const CART_KEY = "CART"
export const DEFAULT_CHARGE = { type: "Fuel Charge", amount: 15 }
const initialOrder = (): OrderForm => ({
  subtotal: 0, taxAmount: 0, total: 0, lineItemCount: 0, lineItemQuantity: 0,
  taxableSubtotal: 0, nonTaxableSubtotal: 0,
  charges: { ...DEFAULT_CHARGE }, taxRule: { name: "", rate: 0 },
  po: "", deliveryDate: new Date().toLocaleDateString("en-CA"),
  deliveryWindow: "Anytime", deliveryInstruction: "", items: [],
})

interface OrderStore {
  order: OrderForm
  ready: boolean
  update: (values: Partial<OrderForm>) => void
  addItem: (item: OrderItemInput) => void
  updateItem: (item: OrderItemInput) => void
  removeItem: (id: number, unitName: string) => void
  getItem: (id: number, unitName: string) => OrderItem | undefined
  clear: () => void
}

function recalculate(order: OrderForm, items: OrderItemInput[]): OrderForm {
  const calculated = calculateOrder({ items, taxRate: order.taxRule?.rate, charges: order.charges.amount })
  return { ...order, items: calculated.items, ...calculated.totals }
}

function validItem(item: OrderItemInput) {
  return Number.isInteger(item.id) && item.id > 0 && !!item.unitName &&
    Number.isFinite(item.price) && item.price >= 0 &&
    Number.isFinite(item.baseQuantity) && item.baseQuantity > 0 &&
    !!item.pricing && Number.isFinite(item.pricing.price) &&
    isValidQuantity(item.quantity, item.minQuantity, item.orderIncrement)
}

export const useOrderFormStore = create<OrderStore>()(persist((set, get) => ({
  order: initialOrder(), ready: false,
  update: (values) => set((state) => ({
    order: recalculate({ ...state.order, ...values }, values.items ?? state.order.items),
  })),
  addItem: (item) => {
    const existing = get().getItem(item.id, item.unitName)
    get().updateItem({ ...item, quantity: (existing?.quantity ?? 0) + item.quantity })
  },
  updateItem: (item) => set((state) => {
    if (!state.ready || !Number.isFinite(item.quantity)) return state
    const quantity = normalizeQuantity(item.quantity, item.minQuantity, item.orderIncrement)
    const next = { ...item, quantity }
    if (quantity > 0 && !validItem(next)) return state
    const items = state.order.items.filter((current) => current.id !== item.id || current.unitName !== item.unitName)
    if (quantity > 0) {
      const index = state.order.items.findIndex((current) => current.id === item.id && current.unitName === item.unitName)
      items.splice(index < 0 ? items.length : index, 0, next as OrderItem)
    }
    return { order: recalculate(state.order, items) }
  }),
  removeItem: (id, unitName) => set((state) => ({
    order: recalculate(state.order, state.order.items.filter((item) => item.id !== id || item.unitName !== unitName)),
  })),
  getItem: (id, unitName) => get().order.items.find((item) => item.id === id && item.unitName === unitName),
  clear: () => set((state) => ({ order: { ...initialOrder(), teamId: state.order.teamId, taxRule: state.order.taxRule } })),
}), {
  name: CART_KEY,
  version: 4,
  skipHydration: true,
  partialize: (state) => ({ order: state.order }),
  migrate: () => ({ order: initialOrder() }),
  merge: (persisted, current) => {
    const saved = (persisted as { order?: OrderForm } | undefined)?.order
    if (!saved || !Array.isArray(saved.items)) return current
    const items = saved.items.filter(validItem)
    return { ...current, order: recalculate({ ...initialOrder(), ...saved }, items) }
  },
  storage: createJSONStorage(() => localStorage),
}))

/** Hydrate only the active team's cart. Edit sessions have a separate key. */
export async function initOrderForm(teamId?: string, values?: Partial<OrderForm>) {
  const name = values?.id ? `${CART_KEY}-edit-${values.id}` : `${CART_KEY}-${teamId ?? "guest"}`
  useOrderFormStore.persist.setOptions({ name })
  // Reading storage before setting state prevents overwriting another team's cart.
  const hasCart = !values?.id && !!localStorage.getItem(name)
  if (hasCart) await useOrderFormStore.persist.rehydrate()
  const saved = hasCart ? useOrderFormStore.getState().order : initialOrder()
  const order = { ...saved, ...values, teamId }
  useOrderFormStore.setState({ order: recalculate(order, order.items), ready: true })
}
