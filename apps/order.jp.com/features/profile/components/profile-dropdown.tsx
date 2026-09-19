"use client"

import Link from "next/link"
import { useState } from "react"

import { toast } from "sonner"
import { type AuthType } from "@jp/auth"
import { ChevronsUpDown } from "lucide-react"
import { Button } from "@jp/ui/components/button"
import { PopDrawer } from "@jp/ui/components/jp/pop-drawer"
import { Logout, ShieldCheck, User } from "@solar-icons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@jp/ui/components/avatar"

import { SidebarMenuButton } from "@jp/ui/components/sidebar"
import { useLoader } from "@jp/ui/components/jp"
import { authClient } from "@jp/auth/client"

export const UserProfileDropdown = ({ session }: { session: AuthType }) => {
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
      <div className="mb-3 flex items-start gap-3 rounded-lg border bg-neutral-100/50 p-2">
        <div className="flex w-full items-center gap-2">
          <Avatar className="size-10">
            <AvatarImage src={user?.image || ""} alt={user?.name} />
            <AvatarFallback>
              <User className="size-4" />
            </AvatarFallback>
          </Avatar>
          <div className="grid min-w-0 flex-1 text-left">
            <span className="truncate text-sm leading-tight font-semibold">
              {user?.name}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {user?.email}
            </span>
          </div>
        </div>
      </div>

      <Button
        size="sm"
        variant="ghost"
        className="w-full justify-start pl-2"
        asChild
      >
        <Link href="/profile">
          <User />
          Profile settings
        </Link>
      </Button>

      <Button
        size="sm"
        variant="ghost"
        className="w-full justify-start pl-2"
        asChild
      >
        <Link href="/profile/security">
          <ShieldCheck />
          Security
        </Link>
      </Button>

      <Button
        variant="destructive"
        size="sm"
        className="w-full justify-start bg-transparent pl-2"
        onClick={handleLogout}
      >
        <Logout />
        Logout
      </Button>
    </PopDrawer>
  )
}
