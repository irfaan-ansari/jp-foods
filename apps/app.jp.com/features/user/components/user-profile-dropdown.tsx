"use client"

import Link from "next/link"
import { toast } from "sonner"
import { useState } from "react"
import { Logout, ShieldCheck, ShieldCross, User } from "@solar-icons/react"

import { Button } from "@jp/ui/components/button"
import { PopDrawer } from "@jp/ui/components/jp/pop-drawer"
import { SidebarMenuItem } from "@jp/ui/components/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@jp/ui/components/avatar"
import { Tooltip } from "@jp/ui/components/jp/tooltip"
import { type AuthType } from "@jp/auth"
import { authClient } from "@jp/auth/client"
import { useLoader } from "@jp/ui/components/jp"
import { UserRoleBadge } from "./user-card"

export const UserProfileDropdown = ({
  session,
  className,
}: {
  session: AuthType
  className?: string
}) => {
  const user = session?.user
  const loader = useLoader()

  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    loader.show()
    const { error } = await authClient.signOut()
    if (error) {
      toast.error(error.message)
      loader.hide()
    } else {
      window.location.href = "/"
    }
  }

  const handleStopImpersonate = async () => {
    if (!session.session?.impersonatedBy) return
    const { error } = await authClient.admin.stopImpersonating()
    if (!error) window.location.reload()
  }
  return (
    <SidebarMenuItem className={className}>
      <PopDrawer
        open={open}
        setOpen={setOpen}
        side="right"
        sideOffset={10}
        className="data-[slot=popover-content]:w-60"
        trigger={
          <Button
            size="icon-lg"
            variant="ghost"
            className="hover:bg-background"
          >
            <Tooltip content="Account">
              <Avatar className="size-8">
                <AvatarImage src={user?.image ?? ""} alt="Logo" />
                <AvatarFallback className="bg-sidebar-accent">
                  <User />
                </AvatarFallback>
              </Avatar>
            </Tooltip>
          </Button>
        }
      >
        <div className="mb-3 flex items-start gap-3 rounded-lg border bg-neutral-100/50 p-2">
          <Avatar className="size-10">
            <AvatarImage src={user?.image || ""} alt={user?.name} />
            <AvatarFallback>
              <User className="size-4" />
            </AvatarFallback>
          </Avatar>
          <div className="grid min-w-0 flex-1 text-left">
            <span className="truncate text-sm leading-tight font-semibold">
              {user?.name ?? "User Name"}
            </span>
            <span className="mb-1.5 truncate text-sm leading-tight font-medium text-muted-foreground">
              {user?.email}
            </span>
          </div>
        </div>

        {session.session?.impersonatedBy && (
          <Button
            size="sm"
            variant="ghost"
            className="w-full justify-start pl-2"
            onClick={handleStopImpersonate}
          >
            <ShieldCross />
            Stop Impersonating
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          className="w-full justify-start pl-2"
          asChild
        >
          <Link href="/settings/account">
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
          <Link href="/settings/security">
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
    </SidebarMenuItem>
  )
}
