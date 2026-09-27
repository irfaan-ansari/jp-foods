"use client"

import React from "react"
import { Product } from "../product/product.type"
import { withCalculatedPrices } from "@jp/utils/commerce"
import { toOrderItemInput } from "./order-form.utils"
import { useOrderFormStore } from "./order-form.store"
import { useActiveTeam } from "../team/team.data"
import { OrderForm } from "./order-form.type"

export function useOrderItemQuantity(data: Product) {
  const defaultUnit =
    data.sellingUnits.find((unit) => unit.isDefault)?.name ??
    data.sellingUnits[0]?.name

  const [unitName, setUnitName] = React.useState(defaultUnit)

  // useState only reads its argument on first mount. If this hook is
  // reused for a different product (same component instance, new
  // `data` prop) or sellingUnits load in after first render, unitName
  // would otherwise be stuck on whatever the first product's default was.
  React.useEffect(() => {
    setUnitName(defaultUnit)
  }, [defaultUnit])

  const updateItem = useOrderFormStore((state) => state.updateItem)
  const itemId = `${data.id}:${unitName}`
  const item = useOrderFormStore((state) => state.getItem(itemId))

  const sellingUnits = React.useMemo(
    () => withCalculatedPrices(data.sellingUnits ?? [], !!data.catchWeight),
    [data.sellingUnits, data.catchWeight]
  )

  const sellUnit = sellingUnits.find((unit) => unit.name === unitName)

  const value = item?.quantity ?? 0

  const setQuantity = React.useCallback(
    (newValue: number | string) => {
      if (!sellUnit) return
      const numberValue = Math.max(0, Number(newValue) || 0)
      const base = toOrderItemInput(data, sellUnit)

      updateItem({
        ...base,
        id: itemId,
        productId: data.id,
        quantity: numberValue,
      })
    },
    [data, sellUnit, itemId, updateItem]
  )

  return {
    value,
    setQuantity,
    unitName,
    setUnitName,
    sellingUnits,
    sellUnit,
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
