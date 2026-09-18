"use client"

import React from "react"
import { cn } from "@jp/ui/lib/utils"
import { Check, Plus } from "lucide-react"
import { SearchBar } from "@jp/ui/components/jp"
import { Button } from "@jp/ui/components/button"
import { Skeleton } from "@jp/ui/components/skeleton"
import { PopDrawer } from "@jp/ui/components/jp/pop-drawer"
import { useCategories } from "@/features/org/product/product.data"

type CategoryProps = {
  children: React.ReactNode
  selected: string | string[]
  onSelect?: (value: string) => void
  canCreate?: boolean
}

export const CategorySelector = ({
  children,
  selected,
  onSelect,
  canCreate = false,
}: CategoryProps) => {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const { data, isPending } = useCategories()
  console.log(selected)
  const categories = data?.data ?? []

  const multiple = Array.isArray(selected)
  const selectedValues = multiple ? selected : [selected].filter(Boolean)

  // filtered cat
  const filteredCategories = React.useMemo(() => {
    const query = search.trim().toLowerCase()

    return categories.filter((category) => {
      const matches = category.toLowerCase().includes(query)

      if (!matches) return false

      return multiple ? !selectedValues.includes(category) : true
    })
  }, [categories, search, multiple, selectedValues])

  // can create flag
  const canCreateCategory =
    canCreate &&
    search.trim().length > 0 &&
    !categories.some(
      (category) => category.toLowerCase() === search.trim().toLowerCase()
    )

  // handle create
  const handleSelect = (value: string) => {
    onSelect?.(value)
    if (!multiple) {
      setOpen(false)
    }
  }

  // handle create
  const handleCreate = () => {
    const value = search.trim()
    onSelect?.(value)
    setOpen(false)
    setSearch("")
  }

  return (
    <PopDrawer open={open} setOpen={setOpen} trigger={children} modal={true}>
      <div className="flex h-64 flex-col gap-1.5">
        <SearchBar
          onSearch={(value) => setSearch(value)}
          className="max-w-full"
        />

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
                variant={
                  selectedValues.includes(category) ? "secondary" : "ghost"
                }
                onClick={() => handleSelect(category)}
              >
                {category}
              </Button>
            ))
          ) : canCreateCategory ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleCreate}
            >
              <Plus className="mr-2 size-4" />
              Create "{search.trim()}"
            </Button>
          ) : (
            <div className="text-center text-muted-foreground">
              No categories found
            </div>
          )}
        </div>
      </div>
    </PopDrawer>
  )
}
