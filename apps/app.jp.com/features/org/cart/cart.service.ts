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

export const getTeamCartChannel = (organizationId: string, teamId: string) =>
  `org:${organizationId}:team:${teamId}:cart`

export const getOrganizationCartPattern = (organizationId: string) =>
  `org:${organizationId}:team:*:cart`

export const getOrganizationCartStateKey = (organizationId: string) =>
  `org:${organizationId}:cart:state`

const getCartStateField = (teamId: string, userId: string) =>
  `team:${teamId}:user:${userId}`

const MAX_ACTIVITY = 14
const MAX_CART_RECORDS = 14
const KEY_TTL_SECONDS = 60 * 60 * 24 * 30

const getOrganizationCartIndexKey = (organizationId: string) =>
  `org:${organizationId}:cart:updated`

// Migrate existing hash records into the index, then atomically upsert and
// remove old records from both keys. Reads also enforce retention on old data.
const UPSERT_AND_TRIM = `
local records = redis.call('HGETALL', KEYS[1])
for i = 1, #records, 2 do
  if not redis.call('ZSCORE', KEYS[2], records[i]) then
    local ok, payload = pcall(cjson.decode, records[i + 1])
    local at = ok and type(payload) == 'table' and payload.emittedAt or ''
    local y, m, d, h, minute, s, ms = string.match(at, '^(%d+)%-(%d+)%-(%d+)T(%d+):(%d+):(%d+)%.(%d+)Z$')
    local score = 0
    if y then
      score = (tonumber(y) * 10000 + tonumber(m) * 100 + tonumber(d)) * 86400000
        + tonumber(h) * 3600000 + tonumber(minute) * 60000 + tonumber(s) * 1000 + tonumber(ms)
    end
    redis.call('ZADD', KEYS[2], score, records[i])
  end
end
if ARGV[1] ~= '' then
  redis.call('HSET', KEYS[1], ARGV[1], ARGV[2])
  redis.call('ZADD', KEYS[2], ARGV[3], ARGV[1])
end
local excess = redis.call('ZCARD', KEYS[2]) - tonumber(ARGV[4])
if excess > 0 then
  local oldest = redis.call('ZRANGE', KEYS[2], 0, excess - 1)
  redis.call('HDEL', KEYS[1], unpack(oldest))
  redis.call('ZREM', KEYS[2], unpack(oldest))
end
redis.call('EXPIRE', KEYS[1], ARGV[5])
redis.call('EXPIRE', KEYS[2], ARGV[5])
local result = {}
for _, field in ipairs(redis.call('ZREVRANGE', KEYS[2], 0, -1)) do
  local value = redis.call('HGET', KEYS[1], field)
  if value then table.insert(result, value) end
end
return result
`

const cartRecency = (at: string) => {
  const date = new Date(at)
  return (
    Number(at.slice(0, 10).replace(/-/g, "")) * 86_400_000 +
    date.getUTCHours() * 3_600_000 +
    date.getUTCMinutes() * 60_000 +
    date.getUTCSeconds() * 1_000 +
    date.getUTCMilliseconds()
  )
}

const decodeRedisValue = (value: unknown): unknown => {
  if (typeof value !== "string") return value
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

export const getOrganizationCartEvents = async (organizationId: string) => {
  const values = await cartRedis.eval<unknown[]>(
    UPSERT_AND_TRIM,
    [
      getOrganizationCartStateKey(organizationId),
      getOrganizationCartIndexKey(organizationId),
    ],
    ["", "", 0, MAX_CART_RECORDS, KEY_TTL_SECONDS]
  )

  return (Array.isArray(values) ? values : [])
    .map((value) => cartEventPayloadSchema.safeParse(decodeRedisValue(value)))
    .filter((result) => result.success)
    .map((result) => result.data)
}

export const getOrganizationCartActivityKey = (organizationId: string) =>
  `org:${organizationId}:cart:activity`

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
  const now = Date.now()
  const stateKey = getOrganizationCartStateKey(organizationId)
  const field = getCartStateField(teamId, userId)

  const payload: CartEvent = {
    ...cartEventSchema.parse(event),
    organizationId,
    teamId,
    userId,
    emittedAt: new Date(now).toISOString(),
  }

  // Baseline: no previous snapshot means no activity
  const previous = cartEventSchema.safeParse(
    decodeRedisValue(await cartRedis.hget(stateKey, field))
  )
  const activity: CartActivity[] = previous.success
    ? diffCart(previous.data.items, payload.items).map((c) => ({
        id: crypto.randomUUID(),
        kind: c.kind,
        item: {
          id: c.item.id,
          title: c.item.title,
          image: c.item.image,
          unit: c.item.unit,
          price: c.item.price,
        },
        quantity: c.quantity,
        previousQuantity: c.previousQuantity,
        userId,
        userName,
        teamId,
        at: payload.emittedAt,
      }))
    : []

  const activityKey = getOrganizationCartActivityKey(organizationId)
  const pipeline = cartRedis.multi()
  if (activity.length > 0) {
    pipeline.lpush(activityKey, ...activity) // last change ends up at the head
    pipeline.ltrim(activityKey, 0, MAX_ACTIVITY - 1)
    pipeline.expire(activityKey, KEY_TTL_SECONDS)
  }

  await Promise.all([
    cartRedis.eval(
      UPSERT_AND_TRIM,
      [stateKey, getOrganizationCartIndexKey(organizationId)],
      [
        field,
        JSON.stringify(payload),
        cartRecency(payload.emittedAt),
        MAX_CART_RECORDS,
        KEY_TTL_SECONDS,
      ]
    ),
    activity.length > 0 ? pipeline.exec() : Promise.resolve(),
  ])

  return cartRedis.publish(getTeamCartChannel(organizationId, teamId), {
    ...payload,
    activity,
  })
}

export const getOrganizationCartActivity = async (organizationId: string) => {
  await cartRedis.ltrim(
    getOrganizationCartActivityKey(organizationId),
    0,
    MAX_ACTIVITY - 1
  )
  const rows = await cartRedis.lrange(
    getOrganizationCartActivityKey(organizationId),
    0,
    MAX_ACTIVITY - 1
  )
  return rows.flatMap((r) => {
    const parsed = cartActivitySchema.safeParse(decodeRedisValue(r))
    return parsed.success ? [parsed.data] : []
  })
}
