"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { createColumnHelper } from "@tanstack/react-table"
import { Button } from "@jp/ui/components/button"
import type { DataTableFeatures } from "@jp/ui/components/data-table"
import { formatDate } from "@jp/utils"
import type { CandidateApplication } from "../candidate.type"
import { CandidateApplicationBadge } from "./candidate-card"

const column = createColumnHelper<DataTableFeatures, CandidateApplication>()

function CandidateLink({ candidate }: { candidate: CandidateApplication }) {
  const searchParams = useSearchParams()
  const query = searchParams.toString()
  return (
    <Link
      href={`/crm/application/candidates/${candidate.id}${query ? `?${query}` : ""}`}
      className="block"
    >
      <div className="flex min-w-48 items-center gap-2">
        <span className="font-semibold text-foreground">
          {candidate.firstName} {candidate.lastName}
        </span>
        <CandidateApplicationBadge status={candidate.status} />
      </div>
      <div className="text-xs text-muted-foreground">
        {formatDate(candidate.createdAt)}
      </div>
    </Link>
  )
}

function ViewCandidateButton({ id }: { id: CandidateApplication["id"] }) {
  const searchParams = useSearchParams()
  const query = searchParams.toString()
  return (
    <Button size="sm" variant="outline" asChild>
      <Link
        href={`/crm/application/candidates/${id}${query ? `?${query}` : ""}`}
      >
        View
      </Link>
    </Button>
  )
}

export const candidateColumns = column.columns([
  column.accessor("firstName", {
    header: "Candidate",
    cell: ({ row }) => (
      <CandidateLink candidate={row.original} />
    ),
  }),
  column.display({
    id: "contact",
    header: "Contact",
    cell: ({ row }) => (
      <div className="space-y-1">
        <div>{row.original.email}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.phone}
        </div>
      </div>
    ),
  }),
  column.accessor("position", {
    header: "Position",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.position || "—"}
      </span>
    ),
  }),
  column.accessor("location", {
    header: "Location",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.location || "—"}
      </span>
    ),
  }),

  column.display({
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <div className="relative flex justify-end">
        <ViewCandidateButton id={row.original.id} />
      </div>
    ),
  }),
])
