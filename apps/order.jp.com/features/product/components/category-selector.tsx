"use client"

import React from "react"
import { Check } from "lucide-react"
import { Button } from "@jp/ui/components/button"
import { Skeleton } from "@jp/ui/components/skeleton"
import { PopDrawer } from "@jp/ui/components/jp/pop-drawer"
import { SearchBar } from "@jp/ui/components/jp"
import { useCategories } from "../product.data"

type CategoryProps = {
  children: React.ReactNode
  selected: string | undefined
  onSelect?: (value: string) => void
}

export const CategorySelector = ({
  children,
  selected,
  onSelect,
}: CategoryProps) => {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const { data, isPending } = useCategories()

  const categories = data?.data ?? []

  const filteredCategories = React.useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) return categories

    return categories.filter((category: string) =>
      category.toLowerCase().includes(query)
    )
  }, [categories, search])

  return (
    <PopDrawer open={open} setOpen={setOpen} trigger={children} modal={true}>
      <div className="flex h-64 flex-col gap-1.5">
        <SearchBar onSearch={(value) => setSearch(value)} className="h-8" />

        <div className="no-scrollbar flex-1 overflow-auto *:w-full *:justify-start">
          {isPending ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="mt-1 h-8" />
            ))
          ) : filteredCategories.length ? (
            filteredCategories.map((category) => (
              <Button
                key={category}
                size="sm"
                variant={selected === category ? "secondary" : "ghost"}
                onClick={() => {
                  selected === category ? onSelect?.("") : onSelect?.(category)

                  setOpen(false)
                }}
              >
                <span className="truncate">{category}</span>
                <Check
                  className={`ml-auto text-muted-foreground ${selected === category ? "opacity-50" : "opacity-0"}`}
                />
              </Button>
            ))
          ) : (
            <div className="text-center text-muted-foreground">
              No category found
            </div>
          )}
        </div>
      </div>
    </PopDrawer>
  )
}
