"use client"

import { DataTable } from "@jp/ui/components/data-table"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { useCustomerInvites } from "../customer.data"
import { customerInviteColumns } from "./customer-columns"

export const CustomerInviteClient = () => {
  const { searchParamsObj } = useRouterStuff()
  const invites = useCustomerInvites(searchParamsObj)

  return (
    <DataTable
      columns={customerInviteColumns}
      data={invites.data?.data ?? []}
      getRowId={(item) => String(item.id)}
      isLoading={invites.isPending}
      error={{
        isError: invites.isError,
        title: invites.error?.message,
        description: invites.error?.description,
      }}
      empty={{
        isEmpty: invites.data?.data.length === 0,
        title: "No customer invites found.",
        description: "Try adjusting your search or filters.",
      }}
      pagination={invites.data?.pagination}
    />
  )
}
