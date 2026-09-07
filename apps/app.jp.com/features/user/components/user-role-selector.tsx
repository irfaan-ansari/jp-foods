"use client"

import React from "react"
import { Check } from "lucide-react"
import { cn } from "@jp/ui/lib/utils"
import { USER_ROLES } from "../user.const"
import { Button } from "@jp/ui/components/button"
import { PopDrawer, SearchBar } from "@jp/ui/components/jp"

type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]
type UserRoleSelectorProps = {
  children: React.ReactNode
  selected?: string | string[]
  onChange?: (value: UserRole) => void
}

export const UserRoleSelector = ({
  children,
  selected,
  onChange,
}: UserRoleSelectorProps) => {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const isMulti = Array.isArray(selected)

  const filtered = React.useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return USER_ROLES

    return Object.entries(USER_ROLES).filter(([_, role]) =>
      role.label.toLowerCase().includes(query)
    )
  }, [search])

  const isSelected = (role: string) =>
    Array.isArray(selected) ? selected.includes(role) : selected === role

  const handleSelect = (role: string) => {
    const roleWithLabel = USER_ROLES[role as keyof typeof USER_ROLES]
    if (!roleWithLabel) return
    if (isMulti) {
      const current = Array.isArray(selected) ? selected : []

      const next = current.includes(role)
        ? current.filter((r) => r !== role)
        : [...current, role]

      onChange?.(roleWithLabel)
    } else {
      onChange?.(roleWithLabel)
      setOpen(false)
    }
  }

  return (
    <PopDrawer open={open} setOpen={setOpen} trigger={children}>
      <div className="flex flex-col gap-1.5">
        <SearchBar className="h-8" onSearch={setSearch} />

        <div className="no-scrollbar flex-1 overflow-auto">
          {Object.values(filtered).map((role) => {
            const active = isSelected(role.value)

            return (
              <Button
                key={role.value}
                variant="ghost"
                size="sm"
                onClick={() => handleSelect(role.value)}
                className="w-full justify-start"
              >
                {role.label}

                <Check
                  className={cn(
                    "ml-auto size-4 transition-opacity",
                    active ? "opacity-100" : "opacity-0"
                  )}
                />
              </Button>
            )
          })}
        </div>
      </div>
    </PopDrawer>
  )
}
