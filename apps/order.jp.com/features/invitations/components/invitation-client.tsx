"use client"
import React from "react"

import { BlurFade } from "@jp/ui/components/blur-fade"
import { useTeamInvitations } from "../invitation.data"
import { QueryBoundary } from "@/components/query-boundry"
import { EmptyState } from "@jp/ui/components/jp/empty-state"
import { InvitationCard, MemberSkeleton } from "./invitation-card"

export const InvitationClient = () => {
  const invitations = useTeamInvitations()

  return (
    <QueryBoundary
      query={invitations}
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
          title="No invitations found"
          description="Try adjusting your filter."
        />
      }
    >
      {(data) => (
        <div className="h-full flex-1 space-y-2">
          {data.data.map((inv, i) => (
            <BlurFade
              key={inv.id}
              delay={0.25 + i * 0.01}
              inView
              direction="up"
            >
              <InvitationCard data={{ ...inv, teamId: inv.teamId! }} />
            </BlurFade>
          ))}
        </div>
      )}
    </QueryBoundary>
  )
}
