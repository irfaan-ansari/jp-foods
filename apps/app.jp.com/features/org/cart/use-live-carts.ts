"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import type { CartActivity, CartGroup } from "./cart.type"
import {
  getCartGroupKey,
  mergeCartActivity,
  reconcileCartGroups,
} from "./cart.utils"
export { getCartGroupKey } from "./cart.utils"

export function useLiveCarts() {
  const [groups, setGroups] = useState<CartGroup[]>([])
  const [activity, setActivity] = useState<CartActivity[]>([])
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [connected, setConnected] = useState(false)
  const [hasSnapshot, setHasSnapshot] = useState(false)

  useEffect(() => {
    const source = new EventSource("/api/v1/org/cart")

    source.addEventListener("open", () => setConnected(true))
    source.addEventListener("error", () => setConnected(false))
    source.addEventListener("cart.snapshot", (event) => {
      const next = JSON.parse((event as MessageEvent).data) as CartGroup[]
      setGroups((current) => reconcileCartGroups(current, next))
      setHasSnapshot(true)
      setSelectedKey((current) => {
        if (
          current &&
          next.some((group) => getCartGroupKey(group) === current)
        ) {
          return current
        }
        return next[0] ? getCartGroupKey(next[0]) : null
      })
    })
    source.addEventListener("cart.activity", (event) => {
      const next = JSON.parse((event as MessageEvent).data) as CartActivity[]
      setActivity((current) => mergeCartActivity(current, next))
    })
    source.addEventListener("cart.activity.snapshot", (event) => {
      const next = JSON.parse((event as MessageEvent).data) as CartActivity[]
      setActivity((current) => mergeCartActivity(current, next))
    })

    return () => source.close()
  }, [])

  const selected = useMemo(
    () => groups.find((group) => getCartGroupKey(group) === selectedKey),
    [groups, selectedKey]
  )

  const openCart = useCallback((key: string) => {
    setSelectedKey(key)
    setDetailsOpen(true)
  }, [])

  return {
    activity,
    connected,
    hasSnapshot,
    detailsOpen,
    groups,
    openCart,
    selected,
    selectedKey,
    setDetailsOpen,
    selectCart: setSelectedKey,
  }
}
