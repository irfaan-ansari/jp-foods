"use client"

import React from "react"

import {
  QueryState,
  PopDrawer,
  LoadMore,
  SearchBar,
} from "@jp/ui/components/jp"
import { Checkbox } from "@jp/ui/components/checkbox"

import { FieldContent, FieldLabel, FieldTitle } from "@jp/ui/components/field"
import { useInfiniteUsers } from "../user.data"
import { UserRoleBadge } from "./user-card"

type UserOption = {
  id: string
  name: string
}
type UserSelectorProps = {
  selected: string | string[] | undefined
  setSelectedChange: (value: UserOption) => void
  role?: string
  children: React.ReactNode
}

export const UserSelector = ({
  selected = [],
  setSelectedChange,
  role,
  children,
}: UserSelectorProps) => {
  const [open, setOpen] = React.useState(false)
  const [filters, setFilters] = React.useState({
    q: "",
    page: "1",
    ...(role ? { role } : {}),
  })
  const multiple = Array.isArray(selected)

  const {
    data,
    isPending,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isError,
    error,
  } = useInfiniteUsers(filters)

  const options = React.useMemo(() => {
    const users = data?.pages.flatMap((page) => page.data) ?? []
    return (
      users.flatMap((t) => ({
        id: String(t.id),
        name: t.name!,
        role: t.role!,
      })) ?? []
    )
  }, [data])

  const isSelected = (id: string) =>
    multiple
      ? Array.isArray(selected) && selected.includes(id)
      : selected === id

  return (
    <PopDrawer trigger={children} open={open} setOpen={setOpen} modal={true}>
      <div className="flex max-h-[max(520px,70svh)] flex-col gap-1.5 md:max-h-80">
        <SearchBar
          className="max-w-full"
          onSearch={(value) => setFilters({ ...filters, q: value })}
        />
        <div className="no-scrollbar flex-1 overflow-y-auto">
          <QueryState
            isPending={isPending}
            isError={isError}
            error={error}
            isEmpty={options.length === 0}
          >
            {options.map((item) => {
              const checked = isSelected(item.id)
              return (
                <FieldLabel
                  key={item.id}
                  className="relative w-full rounded-xl px-2.5 py-2 hover:bg-secondary has-data-checked:bg-secondary"
                >
                  <FieldContent className="flex-1 gap-0">
                    <FieldTitle className="line-clamp-1">
                      {item.name}
                    </FieldTitle>
                  </FieldContent>
                  <UserRoleBadge status={item.role} />
                  <Checkbox
                    id={item.id}
                    checked={checked}
                    className="size-4 rounded-full"
                    onCheckedChange={() => {
                      setSelectedChange({
                        id: item.id,
                        name: item.name,
                      })
                      if (!multiple) {
                        setOpen(false)
                      }
                    }}
                  />
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
