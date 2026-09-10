import React from "react"
import { User } from "@solar-icons/react"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@jp/ui/components/avatar"

import { CopyButton } from "@jp/ui/components/jp/copy-button"
import { formatPhone, formatDate } from "@jp/utils"
import { Skeleton } from "@jp/ui/components/skeleton"
import { StatusBadge } from "@/components/status-badge"
import type { Member } from "../member.type"
import { Tooltip } from "@jp/ui/components/jp/tooltip"
import { MemberDropdown } from "./member-dropdown"
import { MEMBER_ROLES } from "../member.const"

export const MemberCard = ({ data }: { data: Member }) => {
  return (
    <Card
      className={`h-full shadow-xs transition hover:-translate-y-0.5 hover:bg-secondary/40 hover:shadow-sm ${data.user?.banned ? "grayscale" : ""}`}
      size="sm"
    >
      <CardHeader className="relative">
        <CardAction className="absolute top-0 right-4 flex items-center gap-2">
          <MemberRoleBadge status={data.role} />
          <MemberDropdown data={data} />
        </CardAction>
        <div className="flex items-start gap-2">
          <Avatar size="lg">
            <AvatarImage src={data.user?.image ?? ""} />
            <AvatarFallback>
              <User className="size-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle>{data.user?.name}</CardTitle>
            <div className="grid">
              <CopyButton
                className="**:data-[slot=copy-value]:leading-tight"
                value={formatPhone(data.user?.phoneNumber!)}
              />
              <CopyButton
                className="*:data-[slot=copy-value]:leading-tight"
                value={data.user?.email}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-t border-dashed" />
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="line-clamp-1 flex-1 space-x-4 text-sm text-muted-foreground">
            Last active • {formatDate(data.lastSession)}
          </span>

          <AvatarGroup>
            {data.accounts.map((cus, i) => (
              <Tooltip content={cus.name}>
                <Avatar key={i}>
                  <AvatarImage src={cus.logo ?? ""} />
                  <AvatarFallback>
                    <User className="size-4" />
                  </AvatarFallback>
                </Avatar>
              </Tooltip>
            ))}
          </AvatarGroup>
        </div>
      </CardContent>
    </Card>
  )
}

export const MemberSkeleton = () => {
  return (
    <Card size="sm" className="gap-4 shadow-sm">
      <CardHeader className="flex gap-4">
        <Skeleton className="size-10" />
        <div className="grid flex-1 gap-1.5">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-0.5 w-full" />
      </CardContent>
      <CardContent className="flex items-center">
        <Skeleton className="h-4 w-24" />
        <div className="ml-auto flex -space-x-2">
          <Skeleton className="ml-auto size-9 rounded-full" />
          <Skeleton className="size-9 rounded-full" />
        </div>
      </CardContent>
    </Card>
  )
}

export const MemberRoleBadge = ({ status }: { status: string }) => {
  const map = MEMBER_ROLES[status]! ?? {}
  return <StatusBadge status={map} className="backdrop-blur-lg" />
}
