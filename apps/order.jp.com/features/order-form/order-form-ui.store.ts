import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { Layout } from "./order-form.utils"
import { OrderUIFilters } from "./order-form.type"

interface OrderFormUI {
  layout: Layout
  filters: OrderUIFilters

  isCartOpen: boolean
  setCartOpen: (v: boolean) => void

  selecting: boolean
  selected: number[]

  selectedUnitByProductId: Record<number, string>
  setSelectedUnit: (productId: number, unitName: string) => void

  setLayout: (layout: Layout) => void

  setFilters: (
    filters:
      | Partial<OrderUIFilters>
      | ((prev: OrderUIFilters) => Partial<OrderUIFilters>)
  ) => void

  setSelecting: (selecting: boolean) => void

  toggleSelected: (id: number) => void

  clearSelection: () => void
}

export const useOrderFormUI = create<OrderFormUI>()(
  persist(
    (set, get) => ({
      layout: "grid",

      filters: { q: "", cat: "" },

      isCartOpen: false,
      setCartOpen: (v) => set({ isCartOpen: v }),

      selecting: false,
      selected: [],

      selectedUnitByProductId: {},
      setSelectedUnit: (productId, unitName) =>
        set((state) => ({
          selectedUnitByProductId: {
            ...state.selectedUnitByProductId,
            [productId]: unitName,
          },
        })),

      setLayout: (layout) => set({ layout }),
      setFilters: (filters) =>
        set((state) => ({
          filters: {
            ...state.filters,
            ...(typeof filters === "function"
              ? filters(state.filters)
              : filters),
          },
        })),
      setSelecting: (selecting) =>
        set({
          selecting,
          ...(selecting ? {} : { selected: [] }),
        }),

      toggleSelected: (id) =>
        set((state) => ({
          selected: state.selected.includes(id)
            ? state.selected.filter((x) => x !== id)
            : [...state.selected, id],
        })),

      clearSelection: () => set({ selected: [] }),
    }),
    {
      name: "order-form-ui",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        layout: state.layout,
        filters: state.filters,
      }),
    }
  )
)
