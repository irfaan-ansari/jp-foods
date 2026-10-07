"use client"

import { useEffect, useState } from "react"
import { Search, X } from "lucide-react"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { Button } from "@jp/ui/components/button"

export function CatalogSearch() {
  const { searchParamsObj, queryParams } = useRouterStuff()
  const [value, setValue] = useState(searchParamsObj.q ?? "")
  useEffect(() => setValue(searchParamsObj.q ?? ""), [searchParamsObj.q])

  return (
    <form
      role="search"
      className="flex w-full items-center gap-2 rounded-xl border bg-background p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-primary/30 md:max-w-lg"
      onSubmit={(event) => {
        event.preventDefault()
        queryParams({ set: { q: value.trim(), page: "" }, scroll: false })
      }}
    >
      <Search
        className="ml-3 size-5 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      <label htmlFor="catalog-search" className="sr-only">
        Search the catalog
      </label>
      <input
        id="catalog-search"
        type="search"
        value={value}
        placeholder="Search products..."
        className="h-10 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:appearance-none"
        onChange={(event) => setValue(event.target.value)}
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Clear search"
          onClick={() => {
            setValue("")
            queryParams({ set: { q: "", page: "" }, scroll: false })
          }}
        >
          <X className="size-4" />
        </Button>
      )}
      <Button type="submit" className="rounded-lg px-4">
        Search
      </Button>
    </form>
  )
}
