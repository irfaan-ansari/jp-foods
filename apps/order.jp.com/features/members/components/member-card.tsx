import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@jp/ui/components/card"
import { User } from "@solar-icons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@jp/ui/components/avatar"
import { CopyButton } from "@jp/ui/components/jp/copy-button"
import { formatPhone, formatDate } from "@jp/utils"
import { Skeleton } from "@jp/ui/components/skeleton"

import type { Member } from "../member.type"
import { authClient } from "@jp/auth/client"
import { Badge } from "@jp/ui/components/badge"

export const MemberCard = ({ data }: { data: Member }) => {
  const { data: session } = authClient.useSession()
  const isCurrent = session?.user?.id === data.id
  const { user } = data

  return (
    <Card
      className={`h-full shadow-xs transition hover:-translate-y-0.5 hover:bg-secondary/40 hover:shadow-sm ${user?.banned ? "grayscale" : ""}`}
      size="sm"
    >
      <CardHeader className="relative">
        <div className="flex items-center gap-2">
          <Avatar size="lg" className="overflow-hidden rounded-xl *:rounded-md">
            <AvatarImage src={user.image ?? ""} />
            <AvatarFallback>
              <User className="size-4" />
            </AvatarFallback>
          </Avatar>

          <CardTitle>
            {user.name}

            {isCurrent && (
              <Badge className="translate-x-2" variant="success-light">
                You
              </Badge>
            )}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <CopyButton
          className="**:data-[slot=copy-value]:leading-tight"
          value={formatPhone(user.phoneNumber!)}
        />
        <CopyButton
          className="*:data-[slot=copy-value]:leading-tight"
          value={user.email}
        />
        <div className="border-t border-dashed" />
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="line-clamp-1 flex-1 space-x-4 text-sm text-muted-foreground">
            Last active • {formatDate(data.lastActive)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export const MemberSkeleton = () => {
  return (
    <Card size="sm" className="gap-6 shadow-xs">
      <CardHeader className="flex items-center gap-4">
        <Skeleton className="size-10" />
        <Skeleton className="h-4 w-2/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-6 w-full" />
      </CardContent>
      <CardContent className="flex items-center">
        <Skeleton className="h-4 w-24" />
      </CardContent>
    </Card>
  )
}
