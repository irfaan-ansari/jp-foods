"use client"

import React from "react"
import { Check } from "lucide-react"
import { Button } from "@jp/ui/components/button"
import { PopDrawer } from "@jp/ui/components/jp"
import { MEMBER_ROLES } from "../member.const"

export const MemberRoleSelector = ({
  selected,
  children,
  onChange,
}: {
  selected: string
  children: React.ReactNode
  onChange: (value: string) => void
}) => {
  const [open, setOpen] = React.useState(false)

  return (
    <PopDrawer open={open} setOpen={setOpen} trigger={children}>
      <div className="flex flex-col gap-1.5">
        <div className="no-scrollbar flex-1 overflow-auto *:w-full *:justify-start">
          {Object.values(MEMBER_ROLES).map((role) => (
            <Button
              variant="ghost"
              className="w-fulll items-center justify-start"
              onClick={() => {
                onChange(role.value)
                setOpen(false)
              }}
            >
              {role.label}
              {selected === role.value && <Check className="ml-auto" />}
            </Button>
          ))}
        </div>
      </div>
    </PopDrawer>
  )
}
