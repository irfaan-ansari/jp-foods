"use client"

import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { createColumnHelper } from "@tanstack/react-table"
import { ImageOff } from "lucide-react"
import type { DataTableFeatures } from "@jp/ui/components/data-table"
import { StatusBadge } from "@/components/status-badge"
import type { Promotion } from "../promotion.type"
import { PLACEMENT, STATUS } from "../promotion.const"
import { PromotionDropdown } from "./promotion-dropdown"

const column = createColumnHelper<DataTableFeatures, Promotion>()

function PromotionLink({ promotion }: { promotion: Promotion }) {
  const searchParams = useSearchParams()
  const query = searchParams.toString()
  return (
    <Link
      href={`/org/promotions/${promotion.id}${query ? `?${query}` : ""}`}
      className="font-semibold text-foreground hover:underline"
    >
      {promotion.name}
    </Link>
  )
}

export const promotionColumns = column.columns([
  column.accessor("name", {
    header: "Promotion",
    cell: ({ row }) => (
      <div className="flex min-w-56 items-center gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
          {row.original.media ? (
            <Image
              src={row.original.media}
              alt=""
              width={48}
              height={48}
              className="size-full object-cover"
            />
          ) : (
            <ImageOff className="size-4 text-muted-foreground" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <PromotionLink promotion={row.original} />
          <StatusBadge
            status={STATUS[row.original.status] ?? STATUS.inactive!}
          />
        </div>
      </div>
    ),
  }),
  column.accessor("placement", {
    header: "Placement",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {PLACEMENT[row.original.placement] ?? row.original.placement}
      </span>
    ),
  }),
  column.display({
    id: "audience",
    header: "Audience",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.target === "all"
          ? "All customers"
          : `${row.original.teams.length} customers`}
      </span>
    ),
  }),
  column.display({
    id: "products",
    header: "Products",
    cell: ({ row }) => (
      <span className="text-muted-foreground tabular-nums">
        {row.original.products.length}
      </span>
    ),
  }),
  column.display({
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <PromotionDropdown data={row.original} />
      </div>
    ),
  }),
])
