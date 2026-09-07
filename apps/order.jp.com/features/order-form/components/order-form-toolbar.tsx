// order-form-toolbar.tsx
"use client"

import React from "react"
import { CategorySelector } from "@/features/product/components"
import { ToggleGroup, ToggleGroupItem } from "@jp/ui/components/toggle-group"
import { Sort } from "@solar-icons/react"
import { LAYOUT_OPTIONS } from "@/features/order-form/order-form.utils"
import { SearchBar, Tooltip } from "@jp/ui/components/jp"
import { Button } from "@jp/ui/components/button"
import { useOrderFormUI } from "@/features/order-form/order-form-ui.store"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { X } from "lucide-react"

export function OrderFormToolbar() {
  const { pathname } = useRouterStuff()
  const layout = useOrderFormUI((state) => state.layout)
  const setLayout = useOrderFormUI((state) => state.setLayout)
  const filters = useOrderFormUI((state) => state.filters)
  const setFilter = useOrderFormUI((state) => state.setFilters)

  const handleSearch = React.useCallback(
    (value: string) => {
      setFilter((prev) => ({ ...prev, q: value }))
    },
    [setFilter]
  )

  return (
    <div className="flex gap-4">
      <ToggleGroup
        type="single"
        value={layout}
        variant="outline"
        spacing={0}
        className="rounded-lg border px-px"
        onValueChange={(newLayout) => setLayout(newLayout)}
      >
        {LAYOUT_OPTIONS.map((layout) => (
          <Tooltip content={layout.label} key={layout.value}>
            <ToggleGroupItem
              key={layout.value}
              value={layout.value}
              className="aria-checked:bg-secondary"
            >
              <layout.icon />
            </ToggleGroupItem>
          </Tooltip>
        ))}
      </ToggleGroup>

      {!pathname.includes("guides") && (
        <CategorySelector
          selected={filters.cat}
          onSelect={(e) => setFilter({ cat: e })}
        >
          <Button variant="outline">
            <Sort />
            {filters.cat ? (
              <>
                {filters.cat}
                <span
                  onClick={(e) => {
                    e.preventDefault()
                    setFilter({ cat: "" })
                  }}
                  className="inline-flex size-5 items-center justify-center rounded-full bg-neutral-200 hover:text-destructive"
                >
                  <X className="size-3.5" />
                </span>
              </>
            ) : (
              <span className="text-muted-foreground">All Categories</span>
            )}
          </Button>
        </CategorySelector>
      )}

      <SearchBar
        className="ml-auto"
        value={filters.q}
        onSearch={handleSearch}
      />
    </div>
  )
}
