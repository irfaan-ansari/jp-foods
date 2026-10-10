"use client"

import { useEffect } from "react"
import { UserRounded } from "@solar-icons/react"
import { authClient } from "@jp/auth/client"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@jp/ui/components/avatar"
import { Tooltip } from "@jp/ui/components/jp/tooltip"
import { usePostPresence, usePresence } from "@/features/auth/auth.data"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@jp/ui/components/hover-card"

const HEARTBEAT_INTERVAL = 30 * 1000
const MAX_VISIBLE_USERS = 5

export const PresenceUsers = () => {
  const { data: sessionData, isPending } = authClient.useSession()
  const { mutate } = usePostPresence()
  const { data } = usePresence()

  const users = (data?.data ?? []).filter(
    (user) => user.id !== sessionData?.user.id
  )
  const visibleUsers = users.slice(0, MAX_VISIBLE_USERS)
  const hiddenCount = Math.max(users.length - visibleUsers.length, 0)

  useEffect(() => {
    if (isPending || !sessionData?.session) return

    mutate()
    const intervalId = window.setInterval(() => mutate(), HEARTBEAT_INTERVAL)

    return () => window.clearInterval(intervalId)
  }, [isPending, mutate, sessionData?.session?.id])

  if (users.length === 0) {
    return null
  }

  return (
    <div>
      <p className="mb-2 text-xs font-medium text-green-600">Online</p>
      <AvatarGroup className="flex-col items-center justify-center -space-y-2 -space-x-0">
        {visibleUsers.map((user) => (
          <Tooltip key={user.id} content={user.name} side="right">
            <Avatar>
              {user.image && <AvatarImage src={user.image} alt={user.name} />}
              <AvatarFallback>
                <UserRounded />
              </AvatarFallback>
            </Avatar>
          </Tooltip>
        ))}
        {hiddenCount > 0 && (
          <HoverCard>
            <HoverCardTrigger asChild>
              <AvatarGroupCount className="size-7 text-xs">
                +{hiddenCount}
              </AvatarGroupCount>
            </HoverCardTrigger>
            <HoverCardContent className="w-auto max-w-64 p-2" align="start">
              <AvatarGroup>
                {users.slice(MAX_VISIBLE_USERS).map((user) => (
                  <Tooltip key={user.id} content={user.name} side="right">
                    <Avatar>
                      <AvatarImage src={user.image ?? ""} alt={user.name} />
                      <AvatarFallback>
                        <UserRounded />
                      </AvatarFallback>
                    </Avatar>
                  </Tooltip>
                ))}
              </AvatarGroup>
            </HoverCardContent>
          </HoverCard>
        )}
      </AvatarGroup>
    </div>
  )
}
