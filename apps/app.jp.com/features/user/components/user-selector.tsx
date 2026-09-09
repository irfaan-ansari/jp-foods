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
import type { User } from "../user.type"
import { Avatar, AvatarFallback, AvatarImage } from "@jp/ui/components/avatar"
import { User as UserIcon } from "@solar-icons/react"
import { Plus } from "lucide-react"
import { Button } from "@jp/ui/components/button"
import { UserDialog } from "./user-dialog"

type UserSelectorProps = {
  selected: string | string[] | undefined
  setSelectedChange: (value: User) => void
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
    return users.flatMap((t) => ({ ...t })) ?? []
  }, [data])

  const isSelected = (id: string) =>
    multiple
      ? Array.isArray(selected) && selected.includes(id)
      : selected === id

  return (
    <PopDrawer trigger={children} open={open} setOpen={setOpen} modal={true}>
      <div className="flex max-h-[max(520px,70svh)] flex-col gap-1.5 md:max-h-80">
        <div className="relative">
          <SearchBar
            className="max-w-full"
            onSearch={(value) => setFilters({ ...filters, q: value })}
          />
          <UserDialog
            callback={(user) => setFilters({ ...filters, q: user.email })}
            values={{ name: "", phoneNumber: "", email: "", role: role ?? "" }}
          >
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="absolute top-1/2 right-1 -translate-y-1/2 bg-neutral-200"
            >
              <Plus /> Add New
            </Button>
          </UserDialog>
        </div>
        <div className="no-scrollbar flex-1 overflow-y-auto">
          <QueryState
            isPending={isPending}
            isError={isError}
            error={error}
            isEmpty={options.length === 0}
          >
            <div className="space-y-0.5">
              {options.map((item) => {
                const checked = isSelected(item.id)
                return (
                  <FieldLabel
                    key={item.id}
                    className="relative w-full rounded-xl px-2.5 py-2 hover:bg-secondary has-data-checked:bg-secondary"
                  >
                    <FieldContent className="flex flex-1 flex-row gap-2">
                      <Avatar>
                        <AvatarImage src={item.image as string} />
                        <AvatarFallback>
                          <UserIcon className="size-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid">
                        <FieldTitle className="mb-0.5 line-clamp-1">
                          {item.name}
                        </FieldTitle>
                        <div className="space-x-2 text-xs text-muted-foreground">
                          <span>{item.phoneNumber}</span>
                          <span>{item.email}</span>
                        </div>
                      </div>
                    </FieldContent>
                    <UserRoleBadge status={item.role as string} />
                    <Checkbox
                      id={item.id}
                      checked={checked}
                      className="size-4 rounded-full"
                      onCheckedChange={() => {
                        setSelectedChange({
                          ...item,
                        })
                        if (!multiple) {
                          setOpen(false)
                        }
                      }}
                    />
                  </FieldLabel>
                )
              })}
            </div>
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
