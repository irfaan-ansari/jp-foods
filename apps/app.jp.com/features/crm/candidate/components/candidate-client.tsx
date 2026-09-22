"use client"

import { DataTable } from "@jp/ui/components/data-table"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { useCandidateApplications } from "../candidate.data"
import { candidateColumns } from "./candidate-columns"

export const CandidateApplicationClient = ({ status }: { status?: string }) => {
  const { searchParamsObj } = useRouterStuff()
  const candidates = useCandidateApplications(
    status ? { ...searchParamsObj, status } : searchParamsObj
  )

  return (
    <DataTable
      columns={candidateColumns}
      data={candidates.data?.data ?? []}
      getRowId={(item) => String(item.id)}
      isLoading={candidates.isPending}
      error={{
        isError: candidates.isError,
        title: candidates.error?.message,
        description: candidates.error?.description,
      }}
      empty={{
        isEmpty: candidates.data?.data.length === 0,
        title:
          status === "hired"
            ? "No employees found."
            : "No candidate applications found.",
        description: "Try adjusting your search or filters.",
      }}
      pagination={candidates.data?.pagination}
    />
  )
}
