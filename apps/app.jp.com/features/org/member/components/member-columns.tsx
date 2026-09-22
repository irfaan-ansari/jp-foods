"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { createColumnHelper } from "@tanstack/react-table"
import { User } from "@solar-icons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@jp/ui/components/avatar"
import type { DataTableFeatures } from "@jp/ui/components/data-table"
import { formatDate, formatPhone } from "@jp/utils"
import type { Member } from "../member.type"
import { MemberRoleBadge } from "./member-card"
import { MemberDropdown } from "./member-dropdown"

const column = createColumnHelper<DataTableFeatures, Member>()

function MemberLink({ member }: { member: Member }) {
  const searchParams = useSearchParams()
  const query = searchParams.toString()

  return (
    <Link
      href={`/org/settings/members/${member.id}${query ? `?${query}` : ""}`}
      className="flex min-w-48 items-center gap-3"
    >
      <Avatar className="shrink-0">
        <AvatarImage src={member.user?.image ?? ""} alt="" />
        <AvatarFallback>
          <User className="size-4" />
        </AvatarFallback>
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
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.accounts.length
          ? row.original.accounts.map((account) => account.name).join(", ")
          : "—"}
      </span>
    ),
  }),
  column.display({
    id: "lastActive",
    header: "Last active",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.lastSession
          ? formatDate(row.original.lastSession)
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
