import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { OrderForm, OrderItem, OrderItemInput } from "./order-form.type"
import { calculateOrder } from "./order-form.calculate"

const CART_KEY = "CART"
const CART_VERSION = 5

export const DEFAULT_CHARGE = {
  type: "Fuel Charge",
  amount: 15,
}

const initialState: OrderForm = {
  subtotal: 0,
  taxAmount: 0,
  total: 0,
  lineItemCount: 0,
  lineItemQuantity: 0,
  taxableSubtotal: 0,
  nonTaxableSubtotal: 0,
  charges: { type: "Fuel Charge", amount: 15 },
  taxRule: { name: "", rate: 0 },
  po: "",
  deliveryDate: new Date().toISOString().split("T")[0]!,
  deliveryWindow: "Anytime",
  deliveryInstruction: "",
  items: [],
}

interface OrderStore {
  ready: boolean
  order: OrderForm

  update: (values: Partial<OrderForm>) => void

  addItem: (item: OrderItemInput & { quantity: number }) => void
  updateItem: (item: OrderItemInput & { quantity: number }) => void
  removeItem: (id: string) => void

  getItem: (id: string) => OrderItem | undefined

  clear: () => void
}

function stripDerived(items: OrderItem[]): OrderItemInput[] {
  return items.map(({ subtotal, taxAmount, total, ...item }) => item)
}

function recalculate(order: OrderForm, items: OrderItemInput[]): OrderForm {
  const { items: lineItems, totals } = calculateOrder({
    items,
    taxRate: order.taxRule?.rate,
    charges: order.charges.amount,
  })

  return {
    ...order,
    items: lineItems,
    ...totals,
  }
}

export const useOrderFormStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      order: initialState,
      ready: false,
      update: (values) =>
        set((state) => ({
          order: {
            ...state.order,
            ...values,
          },
        })),

      addItem: (product) =>
        set((state) => {
          const items = stripDerived(state.order.items)
          const index = items.findIndex((item) => item.id === product.id)

          if (index === -1) {
            items.push(product)
          } else {
            items[index] = { ...items[index]!, quantity: product.quantity }
          }

          return { order: recalculate(state.order, items) }
        }),

      updateItem: (product) =>
        set((state) => {
          const { quantity: newQuantity, ...productInput } = product
          const items = stripDerived(state.order.items)
          const index = items.findIndex((item) => item.id === productInput.id)

          if (newQuantity <= 0) {
            if (index !== -1) {
              items.splice(index, 1)
            }
          } else if (index === -1) {
            items.push({ ...productInput, quantity: newQuantity })
          } else {
            items[index] = { ...items[index]!, quantity: newQuantity }
          }

          return { order: recalculate(state.order, items) }
        }),

      removeItem: (id) =>
        set((state) => {
          const items = stripDerived(state.order.items).filter(
            (item) => item.id !== id
          )
          return { order: recalculate(state.order, items) }
        }),

      getItem: (id) => get().order.items.find((item) => item.id === id),
      clear: () => set({ order: initialState }),
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

export async function initOrderForm(
  teamId?: string,
  values?: Partial<OrderForm>
) {
  const name = values?.id
    ? `${CART_KEY}-edit-${values.id}`
    : `${CART_KEY}-${teamId}`

  useOrderFormStore.persist.setOptions({ name })

  const hasCart = !values?.id && !!localStorage.getItem(name)
  if (hasCart) await useOrderFormStore.persist.rehydrate()

  const saved = hasCart ? useOrderFormStore.getState().order : initialState
  const order = { ...saved, ...values, teamId }

  useOrderFormStore.setState({
    order: recalculate(order, order.items),
    ready: true,
  })
}
