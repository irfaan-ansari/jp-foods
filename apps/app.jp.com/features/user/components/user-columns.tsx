"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { User as UserIcon } from "@solar-icons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@jp/ui/components/avatar"
import type { DataTableFeatures } from "@jp/ui/components/data-table"
import { formatDate, formatPhone } from "@jp/utils"
import type { User } from "../user.type"
import { UserRoleBadge, UserStatusBadge } from "./user-card"
import { UserDropdown } from "./user-dropdown"

const column = createColumnHelper<DataTableFeatures, User>()

export const userColumns = column.columns([
  column.accessor("name", {
    header: "User",
    cell: ({ row }) => (
      <div className="flex min-w-56 items-center gap-3">
        <Avatar className="shrink-0">
          <AvatarImage src={row.original.image ?? ""} alt="" />
          <AvatarFallback>
            <UserIcon className="size-4" />
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">
              {row.original.name}
            </span>
            <UserStatusBadge
              status={row.original.banned ? "banned" : "active"}
            />
          </div>
          <div className="text-xs text-muted-foreground">
            {row.original.email}
          </div>
        </div>
      </div>
    ),
  }),
  column.accessor("role", {
    header: "Role",
    cell: ({ row }) => <UserRoleBadge status={row.original.role ?? ""} />,
  }),
  column.display({
    id: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.phoneNumber ? formatPhone(row.original.phoneNumber) : "—"}
      </span>
    ),
  }),
  column.display({
    id: "lastActive",
    header: "Last active",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.original.lastSession
          ? formatDate(row.original.lastSession)
          : "Never"}
      </div>
    ),
  }),
  column.display({
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <UserDropdown data={row.original} />
      </div>
    ),
  }),
])
