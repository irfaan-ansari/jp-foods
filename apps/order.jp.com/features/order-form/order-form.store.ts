import { create } from "zustand"
import { calculateOrder } from "./order-form.calculate"
import { persist, createJSONStorage } from "zustand/middleware"
import { OrderForm, OrderItem, OrderItemInput } from "./order-form.type"

const CART_KEY = "CART"

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
  order: OrderForm

  update: (values: Partial<OrderForm>) => void

  addItem: (item: OrderItemInput & { quantity: number }) => void
  updateItem: (item: OrderItemInput & { quantity: number }) => void
  removeItem: (id: number, unitName: string) => void

  getItem: (id: number, unitName: string) => OrderItem | undefined

  clear: () => void
}

// Strips derived per-line fields (subtotal/taxAmount/total) back down to
// plain input, so calculateOrder always recomputes from source data rather
// than compounding stale derived values.
function stripDerived(items: OrderItem[]): OrderItemInput[] {
  return items.map((item) => ({
    id: item.id,
    itemCode: item.itemCode,
    title: item.title,
    price: item.price,
    unitName: item.unitName,
    baseQuantity: item.baseQuantity,
    unitConversion: item.unitConversion,
    minQuantity: item.minQuantity,
    orderIncrement: item.orderIncrement,
    isTaxable: item.isTaxable,
    image: item.image,
    categories: item.categories,
    quantity: item.quantity,
  }))
}

// Single place where items are recalculated — used by add/update/remove so
// totals, tax, and lineItemCount never go stale after any mutation.
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
          const index = items.findIndex(
            (item) =>
              item.id === product.id && item.unitName === product.unitName
          )

          if (index === -1) {
            items.push(product)
          } else {
            const minimum = product.minQuantity > 0 ? product.minQuantity : 1
            const increment =
              product.orderIncrement > 0 ? product.orderIncrement : 1
            const requested = items[index]!.quantity + product.quantity
            items[index] = {
              ...product,
              quantity:
                minimum +
                Math.ceil(Math.max(0, requested - minimum) / increment) *
                  increment,
            }
          }

          return { order: recalculate(state.order, items) }
        }),

      updateItem: (product) =>
        set((state) => {
          const { quantity: newQuantity, ...productInput } = product
          const items = stripDerived(state.order.items)
          const index = items.findIndex(
            (item) =>
              item.id === productInput.id &&
              item.unitName === productInput.unitName
          )

          if (newQuantity <= 0) {
            if (index !== -1) {
              items.splice(index, 1)
            }
          } else if (index === -1) {
            items.push({ ...productInput, quantity: newQuantity })
          } else {
            items[index] = { ...productInput, quantity: newQuantity }
          }

          return { order: recalculate(state.order, items) }
        }),

      removeItem: (id, unitName) =>
        set((state) => {
          const items = stripDerived(state.order.items).filter(
            (item) => item.id !== id || item.unitName !== unitName
          )
          return { order: recalculate(state.order, items) }
        }),

      getItem: (id, unitName) =>
        get().order.items.find(
          (item) => item.id === id && item.unitName === unitName
        ),
      clear: () => set({ order: initialState }),
    }),
    {
      name: CART_KEY,
      version: 3,
      migrate: (persisted) => {
        const previous = persisted as { order?: Partial<OrderForm> }
        const previousItems = previous.order?.items ?? []
        const items = previousItems.filter(
          (item) =>
            typeof item.unitName === "string" &&
            item.unitName.length > 0 &&
            Number.isFinite(item.baseQuantity) &&
            item.baseQuantity > 0 &&
            Number.isFinite(item.price) &&
            item.price >= 0 &&
            Number.isFinite(item.quantity) &&
            item.quantity > 0
        )
        return {
          order: recalculate(
            {
              ...initialState,
              taxRule: previous.order?.taxRule ?? initialState.taxRule,
              charges: previous.order?.charges ?? initialState.charges,
              po: previous.order?.po ?? "",
              deliveryDate:
                previous.order?.deliveryDate ?? initialState.deliveryDate,
              deliveryWindow:
                previous.order?.deliveryWindow ?? initialState.deliveryWindow,
              deliveryInstruction: previous.order?.deliveryInstruction ?? "",
            },
            stripDerived(items)
          ),
        }
      },
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export async function initOrderForm(
  teamId?: string,
  initialOrder?: Partial<OrderForm>
) {
  if (!teamId) {
    useOrderFormStore.persist.setOptions({ name: CART_KEY })
    useOrderFormStore.setState({
      order: { ...initialState, ...initialOrder },
    })
    return
  }

  const name = CART_KEY + "-" + teamId

  useOrderFormStore.persist.setOptions({ name })

  const hasCart = localStorage.getItem(name)

  if (!hasCart) {
    useOrderFormStore.setState({
      order: { ...initialState, ...initialOrder },
    })
  }

  await useOrderFormStore.persist.rehydrate()
}
