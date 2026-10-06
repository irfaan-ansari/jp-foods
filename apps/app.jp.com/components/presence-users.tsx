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

const HEARTBEAT_INTERVAL = 30 * 1000
const MAX_VISIBLE_USERS = 4

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
    <AvatarGroup className="flex-col -space-y-2 -space-x-0">
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
        <AvatarGroupCount className="size-8 text-xs">
          +{hiddenCount}
        </AvatarGroupCount>
      )}
    </AvatarGroup>
  )
}
