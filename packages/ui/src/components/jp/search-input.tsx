"use client"

import * as React from "react"
import { Search } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@jp/ui/components/input-group"
import { cn } from "@jp/ui/lib/utils"

import { useDebounce } from "@jp/ui/hooks/use-debounce"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"

export function SearchQueryParam({
  className,
  placeholder = "Search...",
  ...props
}: React.ComponentProps<"div"> & { placeholder?: string }) {
  const { searchParamsObj, queryParams } = useRouterStuff()
  const [search, setSearch] = React.useState(searchParamsObj.q)

  const debounced = useDebounce(search)

  React.useEffect(() => {
    queryParams({ set: { q: debounced ?? "" } })
  }, [debounced])

  return (
    <InputGroup className={cn("h-10 max-w-xs shrink-0", className)} {...props}>
      <InputGroupAddon>
        <Search className="size-4" />
      </InputGroupAddon>

      <InputGroupInput
        value={search}
        placeholder={placeholder}
        onChange={(e) => setSearch(e.target.value)}
      />
    </InputGroup>
  )
}

type SearchBarProps = React.ComponentProps<"div"> & {
  placeholder?: string
  value?: string
  onSearch: (value: string) => void
}

export function SearchBar({
  className,
  placeholder = "Search...",
  value = "",

  onSearch,
  ...props
}: SearchBarProps) {
  const [search, setSearch] = React.useState(value)

  React.useEffect(() => {
    setSearch(value)
  }, [value])

  const debouncedSearch = useDebounce(search)

  React.useEffect(() => {
    onSearch(debouncedSearch)
  }, [debouncedSearch, onSearch])

  return (
    <InputGroup className={cn("h-10 max-w-xs shrink-0", className)} {...props}>
      <InputGroupAddon>
        <Search className="size-4" />
      </InputGroupAddon>

      <InputGroupInput
        value={search}
        placeholder={placeholder}
        onChange={(e) => {
          setSearch(e.target.value)
          onSearch(e.target.value)
        }}
      />
    </InputGroup>
  )
}
