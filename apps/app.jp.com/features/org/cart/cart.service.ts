import { Redis } from "@upstash/redis"

import {
  cartActivitySchema,
  cartEventSchema,
  cartEventPayloadSchema,
  cartRedisEnvSchema,
} from "./cart.schema"
import type {
  CartActivity,
  CartItem,
  CartEvent,
  CartEventInput,
} from "./cart.type"

const redisEnv = cartRedisEnvSchema.parse({
  REDIS_URL: process.env.REDIS_URL,
  REDIS_TOKEN: process.env.REDIS_TOKEN,
})

export const cartRedis = new Redis({
  url: redisEnv.REDIS_URL,
  token: redisEnv.REDIS_TOKEN,
})

const CART_KEY = "cart"
const CART_ACTIVITY_KEY = "cart:activity"
const CART_CHANNEL = "cart"
const MAX_ACTIVITY = 14
const KEY_TTL_SECONDS = 60 * 60 * 24 * 30
const ACTIVE_CART_WINDOW_MS = 10 * 60 * 1000

export const getCartChannel = () => CART_CHANNEL

const decodeRedisValue = (value: unknown): unknown => {
  if (typeof value !== "string") return value
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

const readCartEvents = async () => {
  const value = decodeRedisValue(await cartRedis.get(CART_KEY))
  if (!Array.isArray(value)) return []

  return value.flatMap((item) => {
    const parsed = cartEventPayloadSchema.safeParse(item)
    return parsed.success ? [parsed.data] : []
  })
}

const cartKey = (
  event: Pick<CartEvent, "organizationId" | "teamId" | "userId">
) => `${event.organizationId}:${event.teamId}:${event.userId}`

const isActiveCartEvent = (event: Pick<CartEvent, "emittedAt">) =>
  new Date(event.emittedAt).getTime() >= Date.now() - ACTIVE_CART_WINDOW_MS

const CART_STATUS_PRIORITY: Record<CartEvent["status"], number> = {
  submitting: 0,
  active: 0,
  placed: 1,
}

const sortCartEvents = (events: CartEvent[]) =>
  events.sort((a, b) => {
    const priority =
      CART_STATUS_PRIORITY[a.status] - CART_STATUS_PRIORITY[b.status]
    if (priority !== 0) return priority
    return b.emittedAt.localeCompare(a.emittedAt)
  })

export const getOrganizationCartEvents = async (organizationId: string) => {
  const events = await readCartEvents()

  return sortCartEvents(
    events.filter(
      (event) =>
        event.organizationId === organizationId && isActiveCartEvent(event)
    )
  )
}

export const getOrganizationCartActivity = async (organizationId: string) => {
  await cartRedis.ltrim(CART_ACTIVITY_KEY, 0, MAX_ACTIVITY - 1)
  const rows = await cartRedis.lrange(CART_ACTIVITY_KEY, 0, MAX_ACTIVITY - 1)

  return rows.flatMap((row) => {
    const parsed = cartActivitySchema.safeParse(decodeRedisValue(row))
    return parsed.success && parsed.data.organizationId === organizationId
      ? [parsed.data]
      : []
  })
}

const diffCart = (prev: CartItem[], next: CartItem[]) => {
  const before = new Map(prev.map((i) => [i.id, i]))
  const after = new Map(next.map((i) => [i.id, i]))
  const changes: {
    kind: CartActivity["kind"]
    item: CartItem
    quantity: number
    previousQuantity: number
  }[] = []

  for (const item of next) {
    const old = before.get(item.id)
    if (!old)
      changes.push({
        kind: "added",
        item,
        quantity: item.quantity,
        previousQuantity: 0,
      })
    else if (old.quantity !== item.quantity)
      changes.push({
        kind: "quantity_changed",
        item,
        quantity: item.quantity,
        previousQuantity: old.quantity,
      })
  }

  for (const item of prev) {
    if (!after.has(item.id))
      changes.push({
        kind: "removed",
        item,
        quantity: 0,
        previousQuantity: item.quantity,
      })
  }

  return changes
}

export const publishCartEvent = async ({
  organizationId,
  teamId,
  userId,
  userName,
  event,
}: {
  organizationId: string
  teamId: string
  userId: string
  userName?: string
  event: CartEventInput
}) => {
  const payload: CartEvent = {
    ...cartEventSchema.parse(event),
    organizationId,
    teamId,
    userId,
    emittedAt: new Date().toISOString(),
  }

  const events = (await readCartEvents()).filter(isActiveCartEvent)
  const key = cartKey(payload)
  const previous = events.find((item) => cartKey(item) === key)
  if (
    previous?.status === "placed" &&
    payload.status === "active" &&
    payload.itemCount === 0
  ) {
    return 0
  }
  const nextEvents = sortCartEvents([
    payload,
    ...events.filter((item) => cartKey(item) !== key),
  ])

  const activity: CartActivity[] =
    previous && payload.status === "active"
      ? diffCart(previous.items, payload.items).map((change) => ({
          id: crypto.randomUUID(),
          kind: change.kind,
          item: {
            id: change.item.id,
            title: change.item.title,
            image: change.item.image,
            unit: change.item.unit,
            price: change.item.price,
          },
          quantity: change.quantity,
          previousQuantity: change.previousQuantity,
          organizationId,
          userId,
          userName,
          teamId,
          at: payload.emittedAt,
        }))
      : []

  const pipeline = cartRedis.multi()
  pipeline.set(CART_KEY, JSON.stringify(nextEvents), { ex: KEY_TTL_SECONDS })
  if (activity.length > 0) {
    pipeline.lpush(CART_ACTIVITY_KEY, ...activity)
    pipeline.ltrim(CART_ACTIVITY_KEY, 0, MAX_ACTIVITY - 1)
    pipeline.expire(CART_ACTIVITY_KEY, KEY_TTL_SECONDS)
  }
  await pipeline.exec()

  return cartRedis.publish(getCartChannel(), {
    ...payload,
    activity,
  })
}
