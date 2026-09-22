"use client"

import Link from "next/link"
import { useState } from "react"

import { toast } from "sonner"
import { Button } from "@jp/ui/components/button"
import { Check, ChevronsUpDown } from "lucide-react"
import type { DeviceSessions, AuthType } from "@jp/auth"
import { PopDrawer } from "@jp/ui/components/jp/pop-drawer"
import { Logout, ShieldCheck, User } from "@solar-icons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@jp/ui/components/avatar"
import { SidebarMenuButton } from "@jp/ui/components/sidebar"

import { authClient } from "@jp/auth/client"
import { useLoader } from "@jp/ui/components/jp"

export const UserProfileDropdown = ({
  session,
  sessionsList,
}: {
  sessionsList: DeviceSessions
  session: AuthType
}) => {
  const user = session?.user

  const loader = useLoader()

  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    setOpen(false)
    loader.show()
    const { error } = await authClient.signOut()
    if (error) {
      toast.error(error.message)
      loader.hide()
    } else {
      window.location.href = "/"
    }
  }

  async function handleSelect(sessionToken: string) {
    const { error } = await authClient.multiSession.setActive({
      sessionToken,
    })
    if (error) {
      toast.error(error.message)
    }
  }

  return (
    <PopDrawer
      open={open}
      setOpen={setOpen}
      side="right"
      sideOffset={10}
      className="data-[slot=popover-content]:w-60"
      trigger={
        <SidebarMenuButton className="h-auto w-full justify-start px-2 py-2 group-data-[collapsible=icon]:p-0!">
          <Avatar className="size-8">
            <AvatarImage src={user?.image ?? ""} alt={user?.name} />
            <AvatarFallback className="bg-sidebar-accent">
              <User />
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user?.name}</span>
            <span className="truncate text-xs">{user?.email}</span>
          </div>
          <ChevronsUpDown />
        </SidebarMenuButton>
      }
    >
      {sessionsList.map((session) => {
        const listUser = session.user
        return (
          <Button
            variant={user?.id === listUser?.id ? "secondary" : "ghost"}
            className="h-auto w-full justify-start border-transparent px-2 py-1.5 text-left hover:bg-secondary"
            key={listUser?.name}
            onClick={() => handleSelect(session.session.token)}
          >
            <Avatar className="size-9">
              <AvatarImage src={listUser?.image || ""} alt={listUser?.name} />
              <AvatarFallback>
                <User className="size-4" />
              </AvatarFallback>
            </Avatar>
            <div className="grid min-w-0 flex-1 text-left">
              <span className="truncate text-sm leading-tight font-semibold">
                {listUser?.name}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {listUser?.email}
              </span>
            </div>

            <Check
              className={`size-3.5 ${user?.id === listUser?.id ? "opacity-100" : "opacity-0"}`}
            />
          </Button>
        )
      })}

      <Button variant="ghost" className="h-9 w-full justify-start pl-2" asChild>
        <Link href="/profile">
          <User />
          Profile settings
        </Link>
      </Button>

      <Button variant="ghost" className="h-9 w-full justify-start pl-2" asChild>
        <Link href="/profile/security">
          <ShieldCheck />
          Security
        </Link>
      </Button>

      <Button
        variant="destructive"

        className="h-9 w-full justify-start bg-transparent pl-2"
        onClick={handleLogout}
      >
        <Logout />
        Logout
      </Button>
    </PopDrawer>
  )
}
