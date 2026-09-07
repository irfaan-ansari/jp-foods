"use client"

import React from "react"
import { Check } from "lucide-react"
import { Button } from "@jp/ui/components/button"
import { PopDrawer, SearchBar } from "@jp/ui/components/jp"

const ROLES = [
  { label: "Admin", value: "admin" },
  { label: "Manager", value: "manager" },
  { label: "Sales", value: "sales" },
  { label: "Customer", value: "customer" },
]

export const MemberRoleSelector = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const FILTERED = React.useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return ROLES
    return ROLES.filter((role) => role.label.toLowerCase().includes(query))
  }, [search])

  return (
    <PopDrawer open={open} setOpen={setOpen} trigger={children}>
      <div className="flex flex-col gap-1.5">
        <SearchBar onSearch={(value) => setSearch(value)} className="h-8" />
        <div className="no-scrollbar flex-1 overflow-auto *:w-full *:justify-start">
          {FILTERED.map((role) => (
            <Button
              variant="ghost"
              size="sm"
              className="w-fulll items-center justify-start"
            >
              {role.label}
              <Check className="ml-auto size-3.5 opacity-50" />
            </Button>
          ))}
        </div>
      </div>
    </PopDrawer>
  )
}
