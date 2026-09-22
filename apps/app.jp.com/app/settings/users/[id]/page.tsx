"use client"

import React from "react"
import { useParams } from "next/navigation"
import { ErrorState } from "@jp/ui/components/jp/empty-state"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { PageContent, PageHeader } from "@/components/page-content"
import { useUser } from "@/features/user/user.data"
import { UserDetailsClient } from "@/features/user/components/user-details-client"

const UserDetailPage = () => {
  const { id } = useParams()
  const { searchParams } = useRouterStuff()
  const { data: user, isPending, isError, error } = useUser(id as string)
  const data = user?.data! ?? {}

  return (
    <React.Fragment>
      <PageHeader
        loading={isPending}
        title={data?.name ?? "User details"}
        backUrl={`/settings/users?${searchParams}`}
      />
      <PageContent loading={isPending}>
        {isError ? (
          <ErrorState title={error.message} description={error.description} />
        ) : (
          <UserDetailsClient data={data} />
        )}
      </PageContent>
    </React.Fragment>
  )
}

export default UserDetailPage
