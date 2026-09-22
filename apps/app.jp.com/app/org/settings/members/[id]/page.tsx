"use client"

import React from "react"
import { useParams } from "next/navigation"
import { ErrorState } from "@jp/ui/components/jp/empty-state"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { PageContent, PageHeader } from "@/components/page-content"
import { useMember } from "@/features/org/member/member.data"
import { MemberDetailsClient } from "@/features/org/member/components/member-details-client"

const MemberDetailPage = () => {
  const { id } = useParams()
  const { searchParams } = useRouterStuff()
  const { data: member, isPending, isError, error } = useMember(id as string)
  const data = member?.data! ?? {}

  return (
    <React.Fragment>
      <PageHeader
        loading={isPending}
        title={data?.user?.name ?? "Member details"}
        backUrl={`/org/settings/members?${searchParams}`}
      />
      <PageContent loading={isPending}>
        {isError ? (
          <ErrorState title={error.message} description={error.description} />
        ) : (
          <MemberDetailsClient data={data} />
        )}
      </PageContent>
    </React.Fragment>
  )
}

export default MemberDetailPage
