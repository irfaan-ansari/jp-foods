import React from "react"
import { Letter, MenuDots, Phone, User } from "@solar-icons/react"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@jp/ui/components/avatar"

import { Progress } from "@jp/ui/components/progress"
import { CopyButton } from "@jp/ui/components/jp/copy-button"
import { formatPhone, formatUSD } from "@jp/utils"
import { Button } from "@jp/ui/components/button"
import { Skeleton } from "@jp/ui/components/skeleton"

import Link from "next/link"
import type { Team } from "../team.type"
import { Tooltip } from "@jp/ui/components/jp"
import { STATUS } from "../team.const"
import { StatusBadge } from "@/components/status-badge"

export const TeamCard = ({ data }: { data: Team }) => {
  const progress = Math.floor(Math.random() * 100) + 1

  return (
    <Card
      className="relative h-full shadow-xs transition hover:-translate-y-0.5 hover:bg-secondary/40 hover:shadow-sm"
      size="sm"
    >
      <Link href="/org/customers/457" className="absolute inset-0" />
      <CardHeader>
        <CardAction className="flex items-center gap-2">
          <TeamBadge status={data.status ?? "active"} />
          <Button size="icon-sm" variant="outline" className="relative z-1">
            <MenuDots />
          </Button>
        </CardAction>
        <div className="flex min-w-0 items-start gap-2">
          <Avatar size="lg" className="overflow-hidden rounded-xl *:rounded-xl">
            <AvatarImage src={data.logo ?? ""} />
            <AvatarFallback>
              <User className="size-4" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <CardTitle className="line-clamp-1">{data.name}</CardTitle>
            <CardDescription className="truncate">
              {data.managerName}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid">
          <CopyButton
            prefix={<Phone className="size-3.5 shrink-0" />}
            className="**:data-[slot=copy-value]:leading-tight"
            value={formatPhone(data.phoneNumber)}
          />
          <CopyButton
            prefix={<Letter className="size-3.5" />}
            className="min-w-0 *:data-[slot=copy-value]:truncate *:data-[slot=copy-value]:leading-tight"
            value={data.email}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>Available limit</span>
            <span className="font-medium">
              {formatUSD(progress * 7)}/
              <span className="text-muted-foreground">
                {formatUSD(progress * 17)}
              </span>
            </span>
          </div>
          <Progress
            className={`h-1.5 ${progress < 20 ? "**:data-[slot=progress-indicator]:bg-destructive" : progress < 60 ? "**:data-[slot=progress-indicator]:bg-warning" : "**:data-[slot=progress-indicator]:bg-success"}`}
            value={progress}
          />
        </div>
        <div className="mt-auto flex items-center justify-between">
          {data.salesRep?.name && (
            <span className="inline-flex items-center justify-start gap-1 text-sm leading-tight text-muted-foreground">
              <User className="size-3.5" />
              {data.salesRep?.name}
            </span>
          )}
          <AvatarGroup className="ml-auto">
            {data.teamMembers?.map((member, i) => (
              <Tooltip content={member.name} key={member.id}>
                <Avatar key={member.id}>
                  <AvatarImage src={member.image as string} />
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

export const TeamCardSkeleton = () => {
  return (
    <Card size="sm" className="gap-4 shadow-none">
      <CardHeader className="flex gap-4">
        <Skeleton className="size-10" />
        <div className="grid flex-1 gap-1.5">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardHeader>
      <CardContent className="space-y-1.5">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
      </CardContent>
      <CardContent className="flex items-center">
        <Skeleton className="h-4 w-24" />
        <div className="ml-auto flex -space-x-2">
          <Skeleton className="size-9 rounded-full" />
          <Skeleton className="size-9 rounded-full" />
        </div>
      </CardContent>
    </Card>
  )
}

export const TeamBadge = ({ status }: { status: string }) => {
  const map = STATUS[status]! ?? {}
  return <StatusBadge status={map} className="backdrop-blur-lg" />
}
