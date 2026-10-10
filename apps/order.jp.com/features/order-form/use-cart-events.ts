"use client"

import { useEffect, useRef } from "react"
import { authClient } from "@jp/auth/client"
import { apiClient } from "@/lib/api-client"
import { useActiveTeam } from "@/features/team/team.data"
import { useOrderFormStore } from "./order-form.store"
import { OrderItem } from "./order-form.type"

const CART_EVENT_DEBOUNCE = 300

const toCartItems = (items: OrderItem[]) =>
  items.map(({ id, title, price, quantity, unit, total, image }) => ({
    id,
    title,
    price,
    quantity,
    unit,
    total,
    image,
  }))
export function useCartEvents() {
  const { data: session, isPending: sessionPending } = authClient.useSession()
  const { data: team, isPending: teamPending } = useActiveTeam()
  const order = useOrderFormStore((state) => state.order)
  const ready = useOrderFormStore((state) => state.ready)
  const requests = useRef<Promise<void>>(Promise.resolve())
  const userId = session?.user.id
  const teamId = team?.data.id
  const lastSent = useRef<string | null>(null)

  useEffect(() => {
    if (
      sessionPending ||
      teamPending ||
      !userId ||
      !teamId ||
      !ready ||
      order.teamId !== teamId ||
      order.id
    )
      return

    const body = {
      type: "cart.updated" as const,
      status: "active" as const,
      itemCount: order.lineItemCount,
      total: order.total,
      items: toCartItems(order.items),
    }
    const key = JSON.stringify(body)
    if (key === lastSent.current) return // nothing cart-relevant changed

    let cancelled = false
    const timeout = window.setTimeout(() => {
      requests.current = requests.current.then(async () => {
        if (cancelled) return
        try {
          await apiClient.post("/cart", { body })
          lastSent.current = key
        } catch (error) {
          console.error("Failed to publish cart update", error)
        }
      })
    }, CART_EVENT_DEBOUNCE)

    return () => {
      cancelled = true
      window.clearTimeout(timeout)
    }
  }, [order, ready, userId, teamId, sessionPending, teamPending])
}
