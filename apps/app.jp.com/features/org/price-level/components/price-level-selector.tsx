"use client"

import React from "react"

import {
  QueryState,
  PopDrawer,
  LoadMore,
  SearchBar,
} from "@jp/ui/components/jp"
import { Checkbox } from "@jp/ui/components/checkbox"
import { useInfinitePriceLevels } from "../price-level.data"
import { FieldContent, FieldLabel, FieldTitle } from "@jp/ui/components/field"

type PriceLevelOption = {
  id: number
  name: string
}
type ProductSelectorProps = {
  selected: number | number[] | undefined
  setSelectedChange: (value: PriceLevelOption) => void
  children: React.ReactNode
}

export const PriceLevelSelector = ({
  selected = [],
  setSelectedChange,
  children,
}: ProductSelectorProps) => {
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
  } = useInfinitePriceLevels(filters)

  const options = React.useMemo(() => {
    const priceLevels = data?.pages.flatMap((page) => page.data) ?? []
    return (
      priceLevels.flatMap((t) => ({
        id: String(t.id),
        name: t.name!,
        adjustmentType: t.adjustmentType!,
        adjustmentValue: t.adjustmentValue!,
        appliesTo: t.appliesTo!,
      })) ?? []
    )
  }, [data])

  const isSelected = (id: number) =>
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
              const checked = isSelected(Number(item.id))
              return (
                <FieldLabel
                  key={item.id}
                  className="relative w-full rounded-xl px-2.5 py-1 hover:bg-secondary has-data-checked:bg-secondary"
                >
                  <FieldContent className="flex-1 gap-0">
                    <FieldTitle className="line-clamp-1">
                      {item.name}
                    </FieldTitle>
                    <span className="text-sm text-muted-foreground">
                      {item.appliesTo}
                    </span>
                  </FieldContent>
                  <span className="ml-auto text-sm text-muted-foreground">
                    {item.adjustmentValue}
                  </span>
                  <Checkbox
                    id={item.id}
                    checked={checked}
                    className="size-4 rounded-full"
                    onCheckedChange={() => {
                      setSelectedChange({
                        id: Number(item.id),
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
