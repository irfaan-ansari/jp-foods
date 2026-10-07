"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { createColumnHelper } from "@tanstack/react-table"
import { User } from "@solar-icons/react"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@jp/ui/components/avatar"
import type { DataTableFeatures } from "@jp/ui/components/data-table"
import { formatDate, formatPhone } from "@jp/utils"
import type { Member } from "../member.type"

import { MemberDropdown } from "./member-dropdown"
import { isUserActive } from "@/features/shared/shared.utils"
import { MemberRoleBadge } from "./member-client"
import { Badge } from "@jp/ui/components/badge"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@jp/ui/components/hover-card"

const column = createColumnHelper<DataTableFeatures, Member>()

function MemberLink({ member }: { member: Member }) {
  const searchParams = useSearchParams()
  const query = searchParams.toString()

  return (
    <Link
      href={`/settings/users/${member.userId}${query ? `?${query}` : ""}`}
      className="flex min-w-48 items-center gap-3"
    >
      <Avatar className="shrink-0">
        <AvatarImage src={member.user?.image ?? ""} alt="" />
        <AvatarFallback>
          <User className="size-4" />
        </AvatarFallback>
        {isUserActive(member.user?.lastSeenAt) && <AvatarBadge />}
      </Avatar>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">
            {member.user?.name ?? "Unknown user"}
          </span>
          <MemberRoleBadge status={member.role} />
        </div>
        <div className="text-xs text-muted-foreground">
          {member.user?.email ?? "—"}
        </div>
      </div>
    </Link>
  )
}

export const memberColumns = column.columns([
  column.accessor("user", {
    header: "User",
    cell: ({ row }) => <MemberLink member={row.original} />,
  }),
  column.display({
    id: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.user?.phoneNumber
          ? formatPhone(row.original.user.phoneNumber)
          : "—"}
      </span>
    ),
  }),
  column.display({
    id: "customers",
    header: "Customers",
    cell: ({ row }) => {
      const accounts = row.original.accounts
      const visible = accounts.slice(0, 3)
      const hidden = accounts.slice(3)

      return accounts.length === 0 ? (
        <span className="text-muted-foreground">-</span>
      ) : (
        <div className="flex flex-wrap items-center gap-1.5">
          {visible.map((acc) => (
            <Link key={acc.id} href={`/org/customers/${acc.id}`}>
              <Badge variant="outline" className="px-2 py-0.5">
                {acc.name}
              </Badge>
            </Link>
          ))}

          {hidden.length > 0 && (
            <HoverCard openDelay={100} closeDelay={100}>
              <HoverCardTrigger asChild>
                <Badge
                  variant="outline"
                  className="cursor-default font-normal text-muted-foreground"
                >
                  +{hidden.length}{" "}
                  {hidden.length === 1 ? "account" : "accounts"}
                </Badge>
              </HoverCardTrigger>
              <HoverCardContent align="start" className="w-64 p-2">
                <ul className="flex flex-col">
                  {hidden.map((acc) => (
                    <li key={acc.id}>
                      <Link
                        href={`/org/customers/${acc.id}`}
                        className="block rounded-sm px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        {acc.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </HoverCardContent>
            </HoverCard>
          )}
        </div>
      )
    },
  }),
  column.display({
    id: "lastActive",
    header: "Last active",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.user.lastSeenAt
          ? formatDate(row.original.user.lastSeenAt)
          : "Never"}
      </span>
    ),
  }),
  column.display({
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <MemberDropdown data={row.original} />
      </div>
    ),
  }),
])
