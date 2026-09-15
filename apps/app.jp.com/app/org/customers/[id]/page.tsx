"use client"
import React from "react"
import { PageContent, PageHeader } from "@/components/page-content"
import { TeamDetailClient } from "@/features/org/team/components/team-detail-client"
import { ErrorState, PopDrawer } from "@jp/ui/components/jp"
import { Calendar, MenuDots, PenNewRound } from "@solar-icons/react"
import { Button } from "@jp/ui/components/button"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { useParams } from "next/navigation"
import { TeamDropdown } from "@/features/org/team/components/team-dropdown"
import { useTeam, useTeamAnalytics } from "@/features/org/team/team.data"
import { RANGE_DAYS } from "@/features/org/team/team.const"
import { ChevronDown } from "lucide-react"
import Link from "next/link"

const CustomerPage = () => {
  const { id } = useParams<{ id: string }>()
  const [open, setOpen] = React.useState(false)
  const { queryParams, searchParamsObj } = useRouterStuff()

  const { data, isPending, isError, error } = useTeamAnalytics(
    id,
    searchParamsObj
  )
  const { data: team, isPending: teamPending } = useTeam(id)
  const analytics = data?.data!

  return (
    <React.Fragment>
      <PageHeader
        loading={isPending || teamPending}
        backUrl="/org/customers"
        backLabel={team?.data?.name ?? "Analytics"}
        title=""
      >
        <div className="ml-auto flex items-center gap-3">
          <PopDrawer
            open={open}
            setOpen={setOpen}
            trigger={
              <Button variant="outline" className="min-w-36 justify-start">
                <Calendar /> {searchParamsObj.range ?? "All"}
                <ChevronDown className="ml-auto" />
              </Button>
            }
          >
            {Object.entries(RANGE_DAYS).map(([key, val]) => (
              <Button
                key={key}
                variant="ghost"
                className="justify-start"
                onClick={() => queryParams({ set: { range: key } })}
              >
                {val.label}
              </Button>
            ))}
          </PopDrawer>

          <Button
            size="icon"
            variant="outline"
            className="relative z-1"
            asChild
          >
            <Link href={`/org/customers/${team?.data?.id}/edit`}>
              <PenNewRound />
            </Link>
          </Button>
        </div>
      </PageHeader>
      <PageContent loading={isPending || teamPending}>
        {isError ? (
          <ErrorState title={error.message} description={error.description} />
        ) : (
          <TeamDetailClient data={{ analytics, team: team?.data! }} />
        )}
      </PageContent>
    </React.Fragment>
  )
}

export default CustomerPage
