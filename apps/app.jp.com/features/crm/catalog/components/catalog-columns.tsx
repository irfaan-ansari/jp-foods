"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { createColumnHelper } from "@tanstack/react-table"
import type { DataTableFeatures } from "@jp/ui/components/data-table"
import { formatDate, formatPhone } from "@jp/utils"
import type { CatalogInquiry } from "../catalog.type"
import { CatalogInquiryBadge } from "./catalog-card"
import { CatalogDropdown } from "./catalog-dropdown"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@jp/ui/components/hover-card"
import { ChevronDown } from "lucide-react"
import { CopyButton } from "@jp/ui/components/jp/copy-button"

const column = createColumnHelper<DataTableFeatures, CatalogInquiry>()

function CatalogInquiryLink({ inquiry }: { inquiry: CatalogInquiry }) {
  const searchParams = useSearchParams()
  const query = searchParams.toString()

  return (
    <Link
      href={`/crm/application/catalog/${inquiry.id}${query ? `?${query}` : ""}`}
      className="block"
    >
      <div className="flex min-w-48 items-center gap-2">
        <span className="font-semibold text-foreground">
          {inquiry.companyName}
        </span>
        <CatalogInquiryBadge status={inquiry.status} />
      </div>
      <div className="text-xs text-muted-foreground">
        {formatDate(inquiry.createdAt)}
      </div>
    </Link>
  )
}

export const catalogColumns = column.columns([
  column.accessor("companyName", {
    header: "Company",
    cell: ({ row }) => <CatalogInquiryLink inquiry={row.original} />,
  }),
  column.display({
    id: "contact",
    header: "Contact",
    cell: ({ row }) => (
      <div className="space-y-1">
        <div>
          {row.original.firstName} {row.original.lastName}
        </div>
        <div className="text-xs text-muted-foreground">
          {row.original.email}
        </div>
      </div>
    ),
  }),
  column.accessor("phone", {
    header: "Phone",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.phone ? formatPhone(row.original.phone) : "—"}
      </span>
    ),
  }),
  column.accessor("message", {
    header: "Message",
    cell: ({ row }) => (
      <HoverCard>
        <HoverCardTrigger className="inline-flex max-w-40 items-start gap-1">
          <span className="line-clamp-2 w-36 min-w-0 whitespace-normal">
            {row.original.message}
          </span>
          <ChevronDown className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        </HoverCardTrigger>
        <HoverCardContent className="no-scrollbar max-h-64 overflow-auto whitespace-pre-wrap">
          {row.original.message}
        </HoverCardContent>
      </HoverCard>
    ),
  }),
  column.display({
    id: "url",
    header: "Catalog link",
    cell: ({ row }) =>
      row.original.status === "approved" && row.original.url ? (
        <CopyButton value={row.original.url} className="max-w-48" />
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  }),

  column.display({
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <CatalogDropdown data={row.original} />
      </div>
    ),
  }),
])
