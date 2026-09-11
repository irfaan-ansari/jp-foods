"use client"
import React from "react"
import { useParams } from "next/navigation"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { ErrorState } from "@jp/ui/components/jp/empty-state"
import { PageContent, PageHeader } from "@/components/page-content"
import { useCandidateApplication } from "@/features/crm/candidate/candidate.data"

import { CandidateDetailsClient } from "@/features/crm/candidate/components/candidate-details-client"

const ApplicationPageDetail = () => {
  const { id } = useParams()
  const { searchParams } = useRouterStuff()
  const {
    data: order,
    isPending,
    isError,
    error,
  } = useCandidateApplication(id as string)
  const data = order?.data! ?? {}

  return (
    <React.Fragment>
      <PageHeader
        loading={isPending}
        title={`#${data?.id}`}
        backUrl={`/crm/candidates?${searchParams}`}
      ></PageHeader>
      <PageContent loading={isPending}>
        {isError ? (
          <ErrorState title={error.message} description={error.description} />
        ) : (
          <CandidateDetailsClient data={data} />
        )}
      </PageContent>
    </React.Fragment>
  )
}

export default ApplicationPageDetail
