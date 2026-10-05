"use client"

import React from "react"
import { Product } from "../product/product.type"
import { toOrderItemInput } from "./order-form.utils"
import { initOrderForm, useOrderFormStore } from "./order-form.store"
import { useActiveTeam } from "../team/team.data"
import { OrderForm } from "./order-form.type"
import { useOrderFormUI } from "./order-form-ui.store"

export function useOrderItemQuantity(data: Product) {
  const defaultUnit =
    data.sellUnits.find((unit) => unit.isDefault)?.name ??
    data.sellUnits[0]?.name

  const unitName = useOrderFormUI(
    (state) => state.selectedUnitByProductId[data.id] ?? defaultUnit
  )
  const setSelectedUnit = useOrderFormUI((state) => state.setSelectedUnit)

  const setUnitName = React.useCallback(
    (unitName: string) => setSelectedUnit(data.id, unitName),
    [data.id, setSelectedUnit]
  )

  const updateItem = useOrderFormStore((state) => state.updateItem)

  const itemId = `${data.id}:${unitName}`
  const item = useOrderFormStore((state) => state.getItem(itemId))


  const selectedUnit = data.sellUnits?.find((unit) => unit.name === unitName)!

  const cartQuantity = item?.quantity ?? 0

  const addToCart = React.useCallback(
    (newValue: number | string) => {
      if (!selectedUnit) return
      const numberValue = Math.max(0, Number(newValue) || 0)
      const base = toOrderItemInput(data, selectedUnit)

      updateItem({
        ...base,
        id: itemId,
        pricingBasis: data.pricingBasis ?? 'fixed',
        displayPrice: selectedUnit.displayPrice,
        productId: data.id,
        quantity: numberValue,
      })
    },
    [data, selectedUnit, itemId, updateItem]
  )

  return {
    quantity: cartQuantity,
    addToCart,
    cartItem: item,
    selectedUnit,
    setSelectedUnit: setUnitName,
  }
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
