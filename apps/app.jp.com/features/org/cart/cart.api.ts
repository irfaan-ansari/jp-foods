import { Hono } from "hono"
import { streamSSE } from "hono/streaming"
import type { SSEStreamingApi } from "hono/streaming"

import { db, team as teamTable, user as userTable } from "@jp/db"
import { inArray } from "@jp/db/query"
import type { OrgAppContext } from "@/lib/hono/middlewares"
import {
  cartRedis,
  getOrganizationCartEvents,
  getCartChannel,
  getOrganizationCartActivity,
} from "@/features/org/cart/cart.service"
import type {
  CartEvent,
  CartGroup,
  CartPublication,
} from "@/features/org/cart/cart.type"

async function getCartGroups(organizationId: string): Promise<CartGroup[]> {
  const events = await getOrganizationCartEvents(organizationId)
  return getCartGroupsFromEvents(events)
}

async function getCartGroupsFromEvents(
  events: CartEvent[]
): Promise<CartGroup[]> {
  const userIds = [...new Set(events.map((event) => event.userId))]
  const teamIds = [...new Set(events.map((event) => event.teamId))]

  const [users, teams] = await Promise.all([
    userIds.length
      ? db.query.user.findMany({
          where: inArray(userTable.id, userIds),
          columns: { id: true, name: true, image: true },
        })
      : [],
    teamIds.length
      ? db.query.team.findMany({
          where: inArray(teamTable.id, teamIds),
          columns: { id: true, name: true, logo: true },
        })
      : [],
  ])

  const usersById = new Map(users.map((user) => [user.id, user]))
  const teamsById = new Map(teams.map((team) => [team.id, team]))

  return events.map((event) => {
    const user = usersById.get(event.userId)
    const team = teamsById.get(event.teamId)

    return {
      user: {
        id: event.userId,
        name: user?.name ?? "Unknown user",
        image: user?.image ?? "",
      },
      team: {
        id: event.teamId,
        name: team?.name ?? "Unknown team",
        logo: team?.logo ?? "",
      },
      items: event.items,
      status: event.status,
      orderId: event.orderId,
      itemCount: event.itemCount,
      total: event.total,
      updatedAt: event.emittedAt,
    }
  })
}

async function writeCartSnapshot(
  stream: SSEStreamingApi,
  organizationId: string
) {
  await stream.writeSSE({
    event: "cart.snapshot",
    data: JSON.stringify(await getCartGroups(organizationId)),
  })
}

async function writeCartActivity(
  stream: SSEStreamingApi,
  event: CartPublication
) {
  if (!event.activity.length) return
  await stream.writeSSE({
    event: "cart.activity",
    data: JSON.stringify(event.activity.slice().reverse()),
  })
}

export const cartRoutes = new Hono<OrgAppContext>().get("/", (c) => {
  const organizationId = c.get("organizationId")

  return streamSSE(c, async (stream) => {
    const subscriber = cartRedis.subscribe<CartPublication>(getCartChannel())

    const heartbeat = setInterval(() => {
      if (!stream.closed && !stream.aborted) {
        void stream.writeSSE({
          event: "heartbeat",
          data: JSON.stringify({ at: new Date().toISOString() }),
        })
      }
    }, 25_000)

    stream.onAbort(async () => {
      clearInterval(heartbeat)
      await subscriber.unsubscribe()
    })

    subscriber.on("message", (event) => {
      if (event.message.organizationId !== organizationId) return
      void writeCartActivity(stream, event.message)
      void writeCartSnapshot(stream, event.message.organizationId)
    })

    await stream.writeSSE({
      event: "connected",
      data: JSON.stringify({ organizationId }),
      retry: 5_000,
    })
    await writeCartSnapshot(stream, organizationId)
    await stream.writeSSE({
      event: "cart.activity.snapshot",
      data: JSON.stringify(await getOrganizationCartActivity(organizationId)),
    })

    await new Promise<void>((resolve) => {
      stream.onAbort(resolve)
    })
  })
})
