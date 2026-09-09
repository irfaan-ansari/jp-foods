import React from "react"
import { Letter, Smartphone, User } from "@solar-icons/react"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"

import { formatPhone, formatDate } from "@jp/utils"
import { Skeleton } from "@jp/ui/components/skeleton"
import { StatusBadge } from "@/components/status-badge"
import { CopyButton } from "@jp/ui/components/jp/copy-button"
import { Avatar, AvatarFallback, AvatarImage } from "@jp/ui/components/avatar"

import { UserDropdown } from "./user-dropdown"
import type { User as UserType } from "../user.type"
import { STATUS, USER_ROLES } from "../user.const"

export const UserCard = ({ data }: { data: UserType }) => {
  return (
    <Card
      className={`h-full shadow-xs transition hover:-translate-y-0.5 hover:bg-secondary/40 hover:shadow-sm ${data.banned ? "grayscale" : ""}`}
      size="sm"
    >
      <CardHeader className="relative">
        <CardAction className="absolute top-0 right-4 flex items-center gap-2">
          <UserDropdown data={data} />
        </CardAction>
        <div className="flex items-start gap-2">
          <Avatar size="lg" className="overflow-hidden rounded-xl *:rounded-md">
            <AvatarImage src={data.image ?? ""} />
            <AvatarFallback>
              <User className="size-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <CardTitle>{data.name}</CardTitle>
            <div className="flex gap-2">
              <UserRoleBadge status={data.role!} />
              <UserStatusBadge status={data.banned ? "banned" : "active"} />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-0">
          <CopyButton
            prefix={<Smartphone className="size-3.5" />}
            className="w-full **:data-[slot=copy-value]:leading-tight"
            value={formatPhone(data.phoneNumber!)}
          />
          <CopyButton
            prefix={<Letter className="size-3.5" />}
            className="*:data-[slot=copy-value]:leading-tight"
            value={data.email}
          />
        </div>
        <div className="border-t border-dashed" />
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="line-clamp-1 flex-1 space-x-4 text-sm text-muted-foreground">
            Last active • {formatDate(data.lastSession)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export const UserSkeleton = () => {
  return (
    <Card size="sm" className="gap-6 shadow-sm">
      <CardHeader className="flex gap-4">
        <Skeleton className="size-10" />
        <div className="grid flex-1 gap-1.5">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </CardContent>
    </Card>
  )
}

export const UserStatusBadge = ({ status }: { status: string }) => {
  const map = STATUS[status]! ?? {}
  return <StatusBadge status={map} className="backdrop-blur-lg" />
}
export const UserRoleBadge = ({ status }: { status: string }) => {
  const map = USER_ROLES[status]! ?? {}
  return <StatusBadge status={map} className="backdrop-blur-lg" />
}
