"use client"

import Link from "next/link"
import { useState } from "react"

import { toast } from "sonner"
import { Check, Loader2, PlusCircle } from "lucide-react"
import { Button } from "@jp/ui/components/button"
import type { DeviceSessions, AuthType } from "@jp/auth"
import { PopDrawer } from "@jp/ui/components/jp/pop-drawer"
import { Logout, ShieldCheck, ShieldCross, User } from "@solar-icons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@jp/ui/components/avatar"

import { authClient } from "@jp/auth/client"
import { Tooltip, useLoader } from "@jp/ui/components/jp"
import { Separator } from "@jp/ui/components/separator"

export const UserProfileDropdown = ({
  session,
  sessionsList,
}: {
  sessionsList: DeviceSessions
  session: AuthType
}) => {
  const user = session?.user

  const loader = useLoader()
  const [loading, setLoading] = useState("")
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

  const handleStopImpersonate = async () => {
    if (!session.session?.impersonatedBy) return
    const { error } = await authClient.admin.stopImpersonating()
    if (!error) window.location.reload()
  }

  async function handleSelect(sessionToken: string) {
    setLoading(sessionToken)
    const { error } = await authClient.multiSession.setActive({
      sessionToken,
    })
    if (error) {
      toast.error(error.message)
      setLoading("")
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
        <Button size="icon-lg" variant="ghost" className="hover:bg-background">
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
            {loading === session.session.token ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Check
                className={`size-3.5 ${user?.id === listUser?.id ? "opacity-100" : "opacity-0"}`}
              />
            )}
          </Button>
        )
      })}

      {session.session?.impersonatedBy && (
        <Button
          variant="ghost"
          className="h-9 w-full justify-start pl-2"
          onClick={handleStopImpersonate}
        >
          <ShieldCross />
          Stop Impersonating
        </Button>
      )}
      <div className="mt-1 px-2">
        <Separator />
      </div>
      <Button variant="ghost" className="h-9 w-full justify-start pl-2" asChild>
        <Link href="#">
          <PlusCircle />
          Add Account
        </Link>
      </Button>
      <div className="px-2">
        <Separator />
      </div>
      <Button variant="ghost" className="h-9 w-full justify-start pl-2" asChild>
        <Link href="/settings/account">
          <User />
          Profile settings
        </Link>
      </Button>

      <Button variant="ghost" className="h-9 w-full justify-start pl-2" asChild>
        <Link href="/settings/security">
          <ShieldCheck />
          Security
        </Link>
      </Button>
      <div className="px-2">
        <Separator />
      </div>
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
