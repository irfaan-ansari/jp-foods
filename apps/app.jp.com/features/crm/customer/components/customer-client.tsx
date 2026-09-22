"use client"

import { DataTable } from "@jp/ui/components/data-table"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { useCustomerApplications } from "../customer.data"
import { customerApplicationColumns } from "./customer-columns"

export const CustomerApplicationClient = () => {
  const { searchParamsObj } = useRouterStuff()
  const applications = useCustomerApplications(searchParamsObj)

  return (
    <DataTable
      columns={customerApplicationColumns}
      data={applications.data?.data ?? []}
      getRowId={(item) => String(item.id)}
      isLoading={applications.isPending}
      error={{
        isError: applications.isError,
        title: applications.error?.message,
        description: applications.error?.description,
      }}
      empty={{
        isEmpty: applications.data?.data.length === 0,
        title: "No customer applications found.",
        description: "Try adjusting your search or filters.",
      }}
      pagination={applications.data?.pagination}
    />
  )
}
