"use client"

import { DataTable } from "@jp/ui/components/data-table"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { useUsers } from "../user.data"
import { userColumns } from "./user-columns"

export const UserClient = () => {
  const { searchParamsObj } = useRouterStuff()
  const users = useUsers(searchParamsObj)

  return (
    <DataTable
      columns={userColumns}
      data={users.data?.data ?? []}
      getRowId={(user) => user.id}
      isLoading={users.isPending}
      error={{
        isError: users.isError,
        title: users.error?.message,
        description: users.error?.description,
      }}
      empty={{
        isEmpty: users.data?.data.length === 0,
        title: "No users found.",
        description: "Try adjusting your search or filters.",
      }}
      pagination={users.data?.pagination}
    />
  )
}
