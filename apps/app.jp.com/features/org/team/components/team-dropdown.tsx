"use client"
import React from "react"
import type { Team } from "../team.type"
import { Button } from "@jp/ui/components/button"
import { PopDrawer } from "@jp/ui/components/jp"
import { MenuDots, PenNewRound, UserPlus } from "@solar-icons/react"
import { TeamDialog } from "./team-dialog"

export const TeamDropdown = ({ data }: { data: Team }) => {
  const [open, setOpen] = React.useState(false)
  return (
    <PopDrawer
      open={open}
      setOpen={setOpen}
      trigger={
        <Button size="icon-sm" variant="outline" className="relative z-1">
          <MenuDots />
        </Button>
      }
    >
      <TeamDialog>
        <Button variant="ghost" className="justify-start">
          <PenNewRound />
          Edit
        </Button>
      </TeamDialog>

      <Button variant="ghost" className="justify-start">
        <UserPlus />
        Add User
      </Button>
    </PopDrawer>
  )
}
