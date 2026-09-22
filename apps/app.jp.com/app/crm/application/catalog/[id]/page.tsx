"use client"

import React from "react"
import { useParams } from "next/navigation"
import { ErrorState } from "@jp/ui/components/jp/empty-state"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { PageContent, PageHeader } from "@/components/page-content"
import { useCatalogInquiry } from "@/features/crm/catalog/catalog.data"
import { CatalogDetailsClient } from "@/features/crm/catalog/components/catalog-details-client"

const CatalogInquiryDetailPage = () => {
  const { id } = useParams()
  const { searchParams } = useRouterStuff()
  const {
    data: inquiry,
    isPending,
    isError,
    error,
  } = useCatalogInquiry(id as string)
  const data = inquiry?.data! ?? {}

  return (
    <React.Fragment>
      <PageHeader
        loading={isPending}
        title={`#${data?.id}`}
        backUrl={`/crm/application/catalog?${searchParams}`}
      />
      <PageContent loading={isPending}>
        {isError ? (
          <ErrorState title={error.message} description={error.description} />
        ) : (
          <CatalogDetailsClient data={data} />
        )}
      </PageContent>
    </React.Fragment>
  )
}

export default CatalogInquiryDetailPage
