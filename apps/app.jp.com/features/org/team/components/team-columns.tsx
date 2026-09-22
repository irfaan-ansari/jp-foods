"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { createColumnHelper } from "@tanstack/react-table"
import { Buildings, MenuDots, User } from "@solar-icons/react"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@jp/ui/components/avatar"
import { Button } from "@jp/ui/components/button"
import type { DataTableFeatures } from "@jp/ui/components/data-table"
import type { Team } from "../team.type"
import { CreditProgress, TeamBadge } from "./team-card"
import { TeamDropdown } from "./team-dropdown"
import { CopyButton, Tooltip } from "@jp/ui/components/jp"

const column = createColumnHelper<DataTableFeatures, Team>()

function CustomerLink({ team }: { team: Team }) {
  const searchParams = useSearchParams()
  const query = searchParams.toString()

  return (
    <Link
      href={`/org/customers/${team.id}${query ? `?${query}` : ""}`}
      className="flex items-start gap-3"
    >
      <Avatar className="shrink-0">
        <AvatarImage src={team.logo ?? ""} alt="" />
        <AvatarFallback className="rounded-lg">
          <Buildings className="size-4" />
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 space-y-0.5">
        <div className="font-semibold text-foreground">{team.name}</div>
        <div className="text-xs text-muted-foreground">
          {team.managerName || "No manager"}
        </div>
      </div>
      <TeamBadge status={team.status ?? "suspended"} />
    </Link>
  )
}

export const teamColumns = column.columns([
  column.accessor("name", {
    header: "Customer",
    cell: ({ row }) => <CustomerLink team={row.original} />,
  }),

  column.accessor("email", {
    header: "Contact",
    cell: ({ row }) => (
      <div className="grid space-y-1">
        <CopyButton value={row.original.email || "—"} />
        <CopyButton value={row.original.phoneNumber || "—"} />
      </div>
    ),
  }),
  column.display({
    id: "credit",
    header: "Credit",
    cell: ({ row }) => (
      <CreditProgress
        className="max-w-52 min-w-44"
        value={Number(row.original.creditUsed)}
        max={Number(row.original.creditLimit)}
        disabled={!row.original.creditEnabled}
        unlimited={
          row.original.creditLimit == null ||
          row.original.creditLimit.trim() === ""
        }
      />
    ),
  }),
  column.display({
    id: "team",
    header: "Account User",
    cell: ({ row }) => (
      <AvatarGroup>
        {row.original.teamMembers.map((member) => (
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
    ),
  }),
  column.display({
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <TeamDropdown data={row.original}>
          <Button
            size="icon-sm"
            variant="outline"
            aria-label={`Actions for ${row.original.name}`}
          >
            <MenuDots />
          </Button>
        </TeamDropdown>
      </div>
    ),
  }),
])
