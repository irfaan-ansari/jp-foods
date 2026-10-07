"use client"

import { useEffect, useMemo, useState } from "react"

import type { CartActivity, CartGroup } from "./cart.type"

export function useLiveCarts() {
  const [groups, setGroups] = useState<CartGroup[]>([])
  const [activity, setActivity] = useState<CartActivity[]>([])
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const source = new EventSource("/api/v1/org/cart")

    source.addEventListener("open", () => setConnected(true))
    source.addEventListener("error", () => setConnected(false))
    source.addEventListener("cart.snapshot", (event) => {
      const next = JSON.parse((event as MessageEvent).data) as CartGroup[]
      setGroups(next)
      setSelectedKey((current) => {
        if (current && next.some((group) => getCartGroupKey(group) === current)) {
          return current
        }
        return next[0] ? getCartGroupKey(next[0]) : null
      })
    })
    source.addEventListener("cart.activity", (event) => {
      const next = JSON.parse((event as MessageEvent).data) as CartGroup
      setActivity((current) => [
        { ...next, id: `${getCartGroupKey(next)}:${next.updatedAt}` },
        ...current,
      ].slice(0, 12))
      setSelectedKey((current) => current ?? getCartGroupKey(next))
    })

    return () => source.close()
  }, [])

  const selected = useMemo(
    () => groups.find((group) => getCartGroupKey(group) === selectedKey),
    [groups, selectedKey]
  )

  const openCart = (key: string) => {
    setSelectedKey(key)
    setDetailsOpen(true)
  }

  return {
    activity,
    connected,
    detailsOpen,
    groups,
    openCart,
    selected,
    selectedKey,
    setDetailsOpen,
    selectCart: setSelectedKey,
  }
}

export function getCartGroupKey(group: Pick<CartGroup, "team" | "user">) {
  return `${group.team.id}:${group.user.id}`
}
