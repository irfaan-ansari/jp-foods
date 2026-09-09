"use client"
import React from "react"
import Link from "next/link"
import type { Team } from "../team.type"
import { Button } from "@jp/ui/components/button"
import { PopDrawer } from "@jp/ui/components/jp"
import { PenNewRound, UserPlus } from "@solar-icons/react"

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
      <Button variant="ghost" className="justify-start" asChild>
        <Link href={`/org/customers/${data.id}/edit`}>
          <PenNewRound />
          Edit
        </Link>
      </Button>

      <Button variant="ghost" className="justify-start">
        <UserPlus />
        Add User
      </Button>
    </PopDrawer>
  )
}
