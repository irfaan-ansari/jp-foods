"use client"
import React from "react"

import { Pagination } from "@jp/ui/components/jp/pagination"
import { BlurFade } from "@jp/ui/components/blur-fade"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { EmptyState } from "@jp/ui/components/jp/empty-state"

import { MemberCard, MemberSkeleton } from "./member-card"
import { GridWrapper } from "@/components/page-content"
import { useMembers } from "../member.data"
import { QueryBoundary } from "@/components/query-boundry"

export const MemberClient = () => {
  const { searchParamsObj, queryParams } = useRouterStuff()
  const members = useMembers({ ...searchParamsObj })
  console.log(members.data)
  return (
    <QueryBoundary
      query={members}
      loading={
        <GridWrapper>
          {Array.from({ length: 12 }).map((_, i) => (
            <MemberSkeleton key={i} />
          ))}
        </GridWrapper>
      }
      isEmpty={(data) => data.data.length === 0}
      empty={
        <EmptyState
          title="No members found"
          description="Try adjusting your filter."
        />
      }
    >
      {(data) => (
        <div className="h-full flex-1 space-y-3">
          <GridWrapper>
            {data.data.map((member, i) => (
              <BlurFade
                key={member.id}
                delay={0.25 + i * 0.01}
                inView
                direction="up"
              >
                <MemberCard key={member.id} data={member} />
              </BlurFade>
            ))}
          </GridWrapper>

          <Pagination
            page={data.pagination.page}
            total={data.pagination.total}
            totalPages={data.pagination.totalPages}
            limit={data.pagination.limit}
            onPageChange={(page) =>
              queryParams({ set: { page: page.toString() } })
            }
          />
        </div>
      )}
    </QueryBoundary>
  )
}
