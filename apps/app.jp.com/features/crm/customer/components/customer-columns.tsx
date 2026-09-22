"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { createColumnHelper } from "@tanstack/react-table"
import { Button } from "@jp/ui/components/button"
import type { DataTableFeatures } from "@jp/ui/components/data-table"
import { formatDate } from "@jp/utils"
import type { CustomerApplication, CustomerInvite } from "../customer.type"
import { CustomerApplicationBadge } from "./customer-card"
import { CustomerInviteBadge } from "./customer-invite-card"

const application = createColumnHelper<DataTableFeatures, CustomerApplication>()
const invite = createColumnHelper<DataTableFeatures, CustomerInvite>()

function ApplicationLink({ item }: { item: CustomerApplication }) {
  const searchParams = useSearchParams()
  const query = searchParams.toString()
  return (
    <Link
      href={`/crm/application/customers/${item.id}${query ? `?${query}` : ""}`}
      className="font-semibold text-foreground hover:underline"
    >
      {item.companyName}
    </Link>
  )
}

function ViewCustomerButton({ id }: { id: CustomerApplication["id"] }) {
  const searchParams = useSearchParams()
  const query = searchParams.toString()
  return (
    <Button size="sm" variant="outline" asChild>
      <Link
        href={`/crm/application/customers/${id}${query ? `?${query}` : ""}`}
      >
        View
      </Link>
    </Button>
  )
}

export const customerApplicationColumns = application.columns([
  application.accessor("companyName", {
    header: "Customer application",
    cell: ({ row }) => (
      <div className="flex min-w-56 items-center gap-2">
        <ApplicationLink item={row.original} />
        <CustomerApplicationBadge status={row.original.status} />
      </div>
    ),
  }),
  application.display({
    id: "contact",
    header: "Contact",
    cell: ({ row }) => (
      <div className="space-y-1">
        <div>
          {row.original.officerFirst} {row.original.officerLast}
        </div>
        <div className="text-xs text-muted-foreground">
          {row.original.companyEmail}
        </div>
      </div>
    ),
  }),
  application.display({
    id: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.companyPhone || "—"}
      </span>
    ),
  }),
  application.display({
    id: "location",
    header: "Location",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {[row.original.companyState, row.original.companyZip]
          .filter(Boolean)
          .join(" ") || "—"}
      </span>
    ),
  }),
  application.accessor("createdAt", {
    header: "Applied",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.original.createdAt)}
      </span>
    ),
  }),
  application.display({
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <ViewCustomerButton id={row.original.id} />
      </div>
    ),
  }),
])

export const customerInviteColumns = invite.columns([
  invite.accessor("companyName", {
    header: "Customer invite",
    cell: ({ row }) => (
      <div className="flex min-w-48 items-center gap-2">
        <span className="font-semibold text-foreground">
          {row.original.companyName}
        </span>
        <CustomerInviteBadge status={row.original.status} />
      </div>
    ),
  }),
  invite.accessor("email", {
    header: "Email",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.email}</span>
    ),
  }),
  invite.accessor("phone", {
    header: "Phone",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.phone || "—"}</span>
    ),
  }),
  invite.accessor("createdAt", {
    header: "Invited",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.original.createdAt)}
      </span>
    ),
  }),
])
