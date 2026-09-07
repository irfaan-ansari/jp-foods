import { create } from "zustand"
import { Guide } from "./guide.type"

interface OrderGuideBoardStore {
  board: Guide

  initialize: (board: Guide) => void
  setBoard: (board: Guide) => void

  clear: () => void
}

export const useOrderGuideBoardStore = create<OrderGuideBoardStore>()(
  (set) => ({
    board: {},

    initialize: (board) =>
      set(() => ({
        board,
      })),

    setBoard: (board) =>
      set(() => ({
        board,
      })),

    clear: () =>
      set(() => ({
        board: {},
      })),
  })
)
