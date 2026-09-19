import React from "react"
import { Letter, MenuDots, Smartphone, User } from "@solar-icons/react"
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

import { CopyButton } from "@jp/ui/components/jp/copy-button"
import { formatPhone, formatUSD } from "@jp/utils"
import { Skeleton } from "@jp/ui/components/skeleton"

import Link from "next/link"
import { STATUS } from "../team.const"
import type { Team } from "../team.type"
import { Tooltip } from "@jp/ui/components/jp"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@jp/ui/components/button"
import { TeamDropdown } from "./team-dropdown"
import { cn } from "@jp/ui/lib/utils"

export const TeamCard = ({ data }: { data: Team }) => {
  return (
    <Card
      className="relative h-full shadow-xs transition hover:-translate-y-0.5 hover:bg-secondary/40 hover:shadow-sm"
      size="sm"
    >
      <Link href={`/org/customers/${data.id}`} className="absolute inset-0" />

      <CardHeader>
        <CardAction className="flex items-center gap-2">
          <TeamBadge status={data.status ?? "suspended"} />

          <TeamDropdown data={data}>
            <Button size="icon-sm" variant="outline" className="relative z-1">
              <MenuDots />
            </Button>
          </TeamDropdown>
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
            prefix={<Smartphone className="size-3.5 shrink-0" />}
            className="**:data-[slot=copy-value]:leading-tight"
            value={formatPhone(data.phoneNumber)}
          />

          <CopyButton
            prefix={<Letter className="size-3.5" />}
            className="min-w-0 *:data-[slot=copy-value]:truncate *:data-[slot=copy-value]:leading-tight"
            value={data.email}
          />
        </div>

        <CreditProgress
          value={Number(data.creditUsed?.replaceAll(",", "") ?? 0)}
          max={Number(data.creditLimit?.replaceAll(",", "") ?? 0)}
          disabled={!data.creditEnabled}
          unlimited={data.creditLimit == null || data.creditLimit.trim() === ""}
        />

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Sales Rep.</span>

            {data.salesRep?.name ? (
              <span className="inline-flex items-center gap-1 text-sm leading-tight text-muted-foreground">
                <User className="size-3.5" />
                {data.salesRep.name}
              </span>
            ) : (
              <span className="text-muted-foreground">NA</span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Users</span>

            {data.teamMembers.length === 0 ? (
              <span className="text-muted-foreground">NA</span>
            ) : (
              <AvatarGroup className="ml-auto">
                {data.teamMembers.map((member) => (
                  <Tooltip content={member.name} key={member.id}>
                    <Avatar>
                      <AvatarImage src={member.image as string} />
                      <AvatarFallback>
                        <User className="size-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Tooltip>
                ))}
              </AvatarGroup>
            )}
          </div>
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

interface ProgressProps {
  value?: number
  max?: number
  disabled?: boolean
  unlimited?: boolean
  className?: string
}

export function CreditProgress({
  value = 0,
  max = 100,
  disabled = false,
  unlimited = false,
  className,
}: ProgressProps) {
  const used = Number.isFinite(value) ? Math.max(0, value) : 0
  const limit = Number.isFinite(max) ? Math.max(0, max) : 0
  const progress =
    disabled || unlimited
      ? 0
      : limit > 0
        ? Math.min(100, (used / limit) * 100)
        : used > 0
          ? 100
          : 0
  const atLimit = !disabled && !unlimited && used >= limit
  const status = disabled
    ? "Credit disabled"
    : unlimited
      ? "Unlimited credit"
      : formatUSD(limit) + " limit"
  const description = formatUSD(used) + " used · " + status

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>{formatUSD(used)} used</span>
        <span className={cn(atLimit && "text-destructive")}>{status}</span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-muted"
        role={disabled || unlimited ? "img" : "progressbar"}
        aria-label="Customer credit usage"
        aria-valuemin={disabled || unlimited ? undefined : 0}
        aria-valuemax={disabled || unlimited ? undefined : 100}
        aria-valuenow={disabled || unlimited ? undefined : progress}
        aria-valuetext={disabled || unlimited ? undefined : description}
        aria-description={description}
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-300 motion-reduce:transition-none",
            atLimit ? "bg-destructive" : "bg-primary"
          )}
          style={{ width: progress + "%" }}
        />
      </div>
    </div>
  )
}
export const TeamBadge = ({ status }: { status: string }) => {
  const map = STATUS[status]! ?? {}
  return <StatusBadge status={map} className="backdrop-blur-lg" />
}
