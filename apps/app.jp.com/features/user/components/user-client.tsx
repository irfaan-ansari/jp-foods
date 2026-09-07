"use client"
import React from "react"

import { Pagination } from "@jp/ui/components/jp/pagination"
import { BlurFade } from "@jp/ui/components/blur-fade"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { EmptyState, ErrorState } from "@jp/ui/components/jp/empty-state"

import { GridWrapper } from "@/components/page-content"
import { useUsers } from "../user.data"
import { UserCard, UserSkeleton } from "./user-card"

export const UserClient = () => {
  const { searchParamsObj, queryParams } = useRouterStuff()
  const { data, isPending, isError, error } = useUsers(searchParamsObj)

  if (isPending) {
    return (
      <GridWrapper>
        {[...Array(12)].map((_, i) => (
          <UserSkeleton key={i} />
        ))}
      </GridWrapper>
    )
  }

  if (isError) {
    return <ErrorState title={error.message} description={error.description} />
  }

  if (data?.data?.length === 0) {
    return (
      <EmptyState
        title={"No Member found"}
        description="Try adjusting your filter"
      />
    )
  }

  const { page, total, totalPages, limit } = data?.pagination

  return (
    <div className="h-full flex-1 space-y-3">
      <GridWrapper>
        {data?.data?.map((user, i) => {
          return (
            <BlurFade
              key={user.id}
              delay={0.25 + i * 0.01}
              inView
              direction="up"
            >
              <UserCard data={user} />
            </BlurFade>
          )
        })}
      </GridWrapper>

      {/* pagination */}
      {!isPending && !isError && (
        <Pagination
          page={page}
          total={total}
          totalPages={totalPages}
          limit={limit}
          onPageChange={(page) =>
            queryParams({ set: { page: page.toString() } })
          }
        />
      )}
    </div>
  )
}
