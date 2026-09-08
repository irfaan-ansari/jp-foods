"use client"

import React from "react"

import {
  QueryState,
  PopDrawer,
  LoadMore,
  SearchBar,
} from "@jp/ui/components/jp"
import { Checkbox } from "@jp/ui/components/checkbox"
import { useInfiniteTaxRules } from "../tax-rule.data"
import { FieldContent, FieldLabel, FieldTitle } from "@jp/ui/components/field"

type TaxRuleOption = {
  id: number
  name: string
  rate: string
}
type ProductSelectorProps = {
  selected: number | number[] | undefined
  setSelectedChange: (value: TaxRuleOption) => void
  children: React.ReactNode
}

export const TaxRuleSelector = ({
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
  } = useInfiniteTaxRules(filters)

  const options = React.useMemo(() => {
    const taxRules = data?.pages.flatMap((page) => page.data) ?? []
    return (
      taxRules.flatMap((t) => ({
        id: String(t.id),
        name: t.name!,
        rate: t.rate!,
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
        <div className="no-scrollbar flex-1 space-y-0.5 overflow-y-auto">
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
                  className="relative w-full rounded-xl px-2.5 py-2 hover:bg-secondary has-data-checked:bg-secondary"
                >
                  <FieldContent className="flex-1">
                    <FieldTitle className="line-clamp-1">
                      {item.name}
                    </FieldTitle>
                  </FieldContent>
                  <span className="ml-auto text-sm text-muted-foreground">
                    {item.rate}%
                  </span>
                  <Checkbox
                    id={item.id}
                    checked={checked}
                    className="size-4 rounded-full"
                    onCheckedChange={() => {
                      setSelectedChange({
                        ...item,
                        id: Number(item.id),
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
