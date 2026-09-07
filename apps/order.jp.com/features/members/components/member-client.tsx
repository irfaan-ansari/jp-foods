"use client"
import React from "react"

import { useTeamMembers } from "../member.data"
import { BlurFade } from "@jp/ui/components/blur-fade"
import { MemberCard, MemberSkeleton } from "./member-card"
import { QueryBoundary } from "@/components/query-boundry"
import { EmptyState } from "@jp/ui/components/jp/empty-state"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"

export const MemberClient = () => {
  const { searchParamsObj } = useRouterStuff()
  const members = useTeamMembers(searchParamsObj)

  return (
    <QueryBoundary
      query={members}
      loading={
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <MemberSkeleton key={i} />
          ))}
        </div>
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
        <div className="h-full flex-1 space-y-2">
          {data.data.map((member, i) => (
            <BlurFade
              key={member.id}
              delay={0.25 + i * 0.01}
              inView
              direction="up"
            >
              <MemberCard data={member} />
            </BlurFade>
          ))}
        </div>
      )}
    </QueryBoundary>
  )
}
