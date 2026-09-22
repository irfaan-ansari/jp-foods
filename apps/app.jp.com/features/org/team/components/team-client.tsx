"use client"

import { DataTable } from "@jp/ui/components/data-table"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { useTeams } from "../team.data"
import { teamColumns } from "./team-columns"

export const TeamClient = () => {
  const { searchParamsObj } = useRouterStuff()
  const teams = useTeams(searchParamsObj)

  return (
    <DataTable
      columns={teamColumns}
      data={teams.data?.data ?? []}
      getRowId={(team) => team.id}
      isLoading={teams.isPending}
      error={{
        isError: teams.isError,
        title: teams.error?.message,
        description: teams.error?.description,
      }}
      empty={{
        isEmpty: teams.data?.data.length === 0,
        title: "No customers found.",
        description: "Try adjusting your search or filters.",
      }}
      pagination={teams.data?.pagination}
    />
  )
}
