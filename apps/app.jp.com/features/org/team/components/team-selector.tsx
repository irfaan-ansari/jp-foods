"use client"

import React from "react"

import {
  SearchBar,
  QueryState,
  PopDrawer,
  LoadMore,
} from "@jp/ui/components/jp"
import { Checkbox } from "@jp/ui/components/checkbox"
import { FieldLabel, FieldTitle } from "@jp/ui/components/field"
import type { Team } from "@/features/org/team/team.type"
import { useInfiniteTeams } from "@/features/org/team/team.data"

type TeamType = Pick<Team, "id" | "name">

type TeamSelectorProps = {
  selected: string | string[] | undefined
  setSelectedChange: (value: TeamType) => void
  children: React.ReactNode
}

export const TeamSelector = ({
  selected,
  setSelectedChange,
  children,
}: TeamSelectorProps) => {
  const [open, setOpen] = React.useState(false)
  const [filters, setFilters] = React.useState({ q: "", page: "1" })
  const multiple = Array.isArray(selected)
  const {
    data,
    isPending,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isError,
    error,
  } = useInfiniteTeams(filters)

  const options = React.useMemo(() => {
    const teams = data?.pages.flatMap((page) => page.data) ?? []
    return (
      teams?.map((t) => ({
        id: t.id,
        name: t.name,
      })) ?? []
    )
  }, [data])

  const isSelected = (id: string) =>
    multiple
      ? Array.isArray(selected) && selected.includes(id)
      : selected === id

  return (
    <PopDrawer trigger={children} open={open} setOpen={setOpen} modal>
      <div className="flex max-h-[max(520px,70svh)] flex-col gap-1.5 md:max-h-80">
        <SearchBar onSearch={(value) => setFilters({ ...filters, q: value })} />
        <div className="no-scrollbar flex-1 overflow-y-auto">
          <QueryState
            isPending={isPending}
            isError={isError}
            error={error}
            isEmpty={options.length === 0}
          >
            {options.map((item) => {
              return (
                <FieldLabel
                  key={item.id}
                  htmlFor={item.id}
                  className="relative flex w-full cursor-pointer rounded-lg px-3 py-2"
                >
                  <Checkbox
                    id={item.id}
                    checked={isSelected(item.id)}
                    className="absolute top-2 right-2 size-4 rounded-full"
                    onCheckedChange={() => {
                      setSelectedChange(item)

                      if (!multiple) {
                        setOpen(false)
                      }
                    }}
                  />

                  <FieldTitle className="line-clamp-1">{item.name}</FieldTitle>
                </FieldLabel>
              )
            })}
          </QueryState>

          <LoadMore
            hasMore={hasNextPage}
            loading={isFetchingNextPage}
            onLoadMore={fetchNextPage}
          />
        </div>
      </div>
    </PopDrawer>
  )
}
