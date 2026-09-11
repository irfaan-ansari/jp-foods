"use client"
import React from "react"
import { useParams } from "next/navigation"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { ErrorState } from "@jp/ui/components/jp/empty-state"
import { PageContent, PageHeader } from "@/components/page-content"
import { useCustomerApplication } from "@/features/crm/customer/customer.data"
import { CustomerDetailsClient } from "@/features/crm/customer/components/customer-details-client"

const ApplicationPageDetail = () => {
  const { id } = useParams()
  const { searchParams } = useRouterStuff()
  const {
    data: order,
    isPending,
    isError,
    error,
  } = useCustomerApplication(id as string)
  const data = order?.data! ?? {}

  return (
    <React.Fragment>
      <PageHeader
        loading={isPending}
        title={`#${data?.id}`}
        backUrl={`/crm/customers?${searchParams}`}
      ></PageHeader>
      <PageContent loading={isPending}>
        {isError ? (
          <ErrorState title={error.message} description={error.description} />
        ) : (
          <CustomerDetailsClient data={data} />
        )}
      </PageContent>
    </React.Fragment>
  )
}

export default ApplicationPageDetail
