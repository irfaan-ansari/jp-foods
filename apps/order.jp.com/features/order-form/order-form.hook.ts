"use client"

import React from "react"

import { Product } from "../product/product.type"
import { toOrderItemInput } from "./order-form.utils"
import { initOrderForm, useOrderFormStore } from "./order-form.store"
import { useActiveTeam } from "../team/team.data"
import { OrderForm } from "./order-form.type"

export function useOrderItemQuantity(data: Product) {
  const updateItem = useOrderFormStore((state) => state.updateItem)
  const item = useOrderFormStore((state) => state.getItem(data.id))
  const value = item?.quantity ?? 0

  const setQuantity = React.useCallback(
    (newValue: number | string) => {
      const numberValue = Math.max(0, Number(newValue) || 0)
      const base = item ?? toOrderItemInput(data)
      updateItem({ ...base, quantity: numberValue })
    },
    [item, data, updateItem]
  )

  return { value, setQuantity }
}

export function useOrderForm() {
  const { data: team, isPending } = useActiveTeam()

  const initialize = React.useCallback(
    (initialData?: Partial<OrderForm>) => {
      const activeTeam = team?.data
      if (isPending || !activeTeam) return

      initOrderForm(activeTeam.id, {
        ...initialData,
        taxRule: {
          name: activeTeam.taxRule?.name ?? "",
          rate: Number(activeTeam.taxRule?.rate ?? 0),
        },
      })
    },
    [team, isPending]
  )

  return {
    init: initialize,
    ready: !isPending && !!team?.data,
  }
}
