"use client"

import Link from "next/link"
import { toast } from "sonner"
import { useState } from "react"
import { ChevronsUpDown } from "lucide-react"
import { UserPlus, User, Settings, Shop } from "@solar-icons/react"
import { Button } from "@jp/ui/components/button"

import { PopDrawer } from "@jp/ui/components/jp/pop-drawer"
import { Avatar, AvatarFallback, AvatarImage } from "@jp/ui/components/avatar"
import { authClient } from "@jp/auth/client"
import { SidebarMenuButton } from "@jp/ui/components/sidebar"
import { useActiveTeam } from "../team.data"
import { QueryState, useLoader } from "@jp/ui/components/jp"
import { TeamSelector } from "./team-selector"

export const TeamSwitcher = () => {
  const [open, setOpen] = useState(false)
  const loader = useLoader()

  const { data: activeTeam, isPending: activeTeamPending } = useActiveTeam()

  const handleChange = async ({
    teamId,
    organizationId,
  }: {
    teamId: string
    organizationId: string
  }) => {
    setOpen(false)
    loader.show()

    await authClient.organization.setActive({ organizationId })

    const { error } = await authClient.organization.setActiveTeam({
      teamId,
    })

    if (error) {
      toast.error(error.message)
      loader.hide()
    } else {
      window.location.reload()
    }
  }

  return (
    <QueryState
      isPending={activeTeamPending}
      isError={false}
      className="*:bg-neutral-200"
    >
      <PopDrawer
        open={open}
        setOpen={setOpen}
        side="right"
        align="start"
        sideOffset={10}
        className="data-[slot=popover-content]:w-72!"
        trigger={
          <SidebarMenuButton
            size="default"
            className="h-auto w-full justify-start px-2 py-2 group-data-[collapsible=icon]:p-0!"
          >
            <Avatar className="size-8">
              <AvatarImage src={activeTeam?.data?.logo ?? ""} alt="Logo" />
              <AvatarFallback className="bg-sidebar-accent">
                <Shop />
              </AvatarFallback>
            </Avatar>
            <div className="grid min-w-0 flex-1 text-left">
              <span className="truncate text-sm leading-tight font-semibold">
                {activeTeam?.data?.name}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {activeTeam?.data?.managerName}
              </span>
            </div>

            <ChevronsUpDown />
          </SidebarMenuButton>
        }
      >
        <div className="mb-1 flex flex-col gap-3 rounded-xl bg-neutral-200/50 p-2">
          <div className="flex items-center gap-2">
            <Avatar className="size-10">
              <AvatarImage
                src={activeTeam?.data?.logo || ""}
                alt={activeTeam?.data?.name}
              />
              <AvatarFallback>
                <User className="size-4" />
              </AvatarFallback>
            </Avatar>
            <div className="grid min-w-0 flex-1 text-left">
              <span className="truncate text-sm leading-tight font-semibold">
                {activeTeam?.data?.name}
              </span>

              <span className="truncate text-xs text-muted-foreground">
                {activeTeam?.data?.managerName}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              asChild
              size="sm"
              className="h-7 px-2"
              onClick={() => setOpen(false)}
            >
              <Link href="/settings/general">
                <Settings className="size-3.5" />
                Settings
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              size="sm"
              className="h-7 px-2"
              onClick={() => setOpen(false)}
            >
              <Link href="/settings/members">
                <UserPlus className="size-3.5" />
                Invite members
              </Link>
            </Button>
          </div>
        </div>

        <TeamSelector selected={activeTeam?.data?.id} onChange={handleChange} />
      </PopDrawer>
    </QueryState>
  )
}
