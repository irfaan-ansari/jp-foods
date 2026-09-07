"use client"
import React from "react"

import { Pagination } from "@jp/ui/components/jp/pagination"
import { BlurFade } from "@jp/ui/components/blur-fade"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { EmptyState } from "@jp/ui/components/jp/empty-state"

import { useTeams } from "../team.data"
import { TeamCard, TeamCardSkeleton } from "./team-card"
import { GridWrapper } from "@/components/page-content"
import { QueryBoundary } from "@/components/query-boundry"

export const TeamClient = () => {
  const { searchParamsObj, queryParams } = useRouterStuff()
  const teams = useTeams(searchParamsObj)

  return (
    <QueryBoundary
      query={teams}
      loading={
        <GridWrapper>
          {Array.from({ length: 12 }).map((_, i) => (
            <TeamCardSkeleton key={i} />
          ))}
        </GridWrapper>
      }
      isEmpty={(data) => data.data.length === 0}
      empty={
        <EmptyState
          title="No customers found"
          description="Try adjusting your filter."
        />
      }
    >
      {(data) => (
        <div className="h-full flex-1 space-y-3">
          <GridWrapper>
            {data.data.map((team, i) => (
              <BlurFade
                key={team.id}
                delay={0.25 + i * 0.01}
                inView
                direction="up"
              >
                <TeamCard data={team} />
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
