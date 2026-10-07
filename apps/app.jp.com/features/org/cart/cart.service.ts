import { Redis } from "@upstash/redis"

import {
  cartEventPayloadSchema,
  cartEventSchema,
  cartRedisEnvSchema,
} from "./cart.schema"
import type { CartEvent, CartEventInput } from "./cart.type"

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

export const publishCartEvent = async ({
  organizationId,
  teamId,
  userId,
  event,
}: {
  organizationId: string
  teamId: string
  userId: string
  event: CartEventInput
}) => {
  const payload: CartEvent = {
    ...cartEventSchema.parse(event),
    organizationId,
    teamId,
    userId,
    emittedAt: new Date().toISOString(),
  }

  const [, subscribers] = await Promise.all([
    cartRedis.hset(getOrganizationCartStateKey(organizationId), {
      [getCartStateField(teamId, userId)]: payload,
    }),
    cartRedis.publish(getTeamCartChannel(organizationId, teamId), payload),
  ])

  return subscribers
}

export const getOrganizationCartEvents = async (organizationId: string) => {
  const values = await cartRedis.hvals(
    getOrganizationCartStateKey(organizationId)
  )

  return (Array.isArray(values) ? values : [])
    .map((value) => cartEventPayloadSchema.safeParse(value))
    .filter((result) => result.success)
    .map((result) => result.data)
}
