"use client"
import React from "react"
import type { Team } from "../team.type"
import { Button } from "@jp/ui/components/button"
import { PopDrawer } from "@jp/ui/components/jp"
import { PenNewRound, UserPlus } from "@solar-icons/react"
import { TeamDialog } from "./team-dialog"

export const TeamDropdown = ({
  data,
  children,
}: {
  data: Team
  children: React.ReactNode
}) => {
  const [open, setOpen] = React.useState(false)
  return (
    <PopDrawer open={open} setOpen={setOpen} trigger={children}>
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
