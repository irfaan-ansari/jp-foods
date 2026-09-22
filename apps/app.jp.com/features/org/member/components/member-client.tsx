"use client"

import { DataTable } from "@jp/ui/components/data-table"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { useMembers } from "../member.data"
import { memberColumns } from "./member-columns"

export const MemberClient = () => {
  const { searchParamsObj } = useRouterStuff()
  const members = useMembers(searchParamsObj)
  return (
    <DataTable
      columns={memberColumns}
      data={members.data?.data ?? []}
      getRowId={(member) => member.id}
      isLoading={members.isPending}
      error={{
        isError: members.isError,
        title: members.error?.message,
        description: members.error?.description,
      }}
      empty={{
        isEmpty: members.data?.data.length === 0,
        title: "No users found.",
        description: "Try adjusting your search or filters.",
      }}
      pagination={members.data?.pagination}
    />
  )
}
