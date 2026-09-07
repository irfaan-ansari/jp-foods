"use client"

import Link from "next/link"
import { toast } from "sonner"
import { useState } from "react"

import { UserPlus, User, Settings, AddSquare, Shop } from "@solar-icons/react"
import { Button } from "@jp/ui/components/button"
import { Skeleton } from "@jp/ui/components/skeleton"
import { PopDrawer } from "@jp/ui/components/jp/pop-drawer"
import { SidebarMenuItem } from "@jp/ui/components/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@jp/ui/components/avatar"
import { Tooltip } from "@jp/ui/components/jp/tooltip"
import { authClient } from "@jp/auth/client"
import { OrgAccess } from "@/features/auth/components/org-permission"
import { useLoader } from "@jp/ui/components/jp"
import { OrganizationSelector } from "./organization-selector"
import { useOrganization } from "../organization.data"

export const OrganizationSwitcher = ({
  disabled,
  className,
}: {
  disabled?: boolean
  className?: string
}) => {
  const [open, setOpen] = useState(false)
  const loader = useLoader()

  const { data: org, isPending: orgLoading } = useOrganization()

  const handleChange = async (organizationId: string) => {
    loader.show()
    const { error } = await authClient.organization.setActive({
      organizationId,
    })

    if (error) {
      toast.error(error.message)
      loader.hide()
    } else {
      window.location.reload()
    }
  }

  return (
    <SidebarMenuItem className={className}>
      <PopDrawer
        open={open}
        setOpen={setOpen}
        side="right"
        align="start"
        sideOffset={10}
        className="data-[slot=popover-content]:w-72!"
        trigger={
          <Button
            size="icon-lg"
            variant="ghost"
            className="hover:bg-background"
            disabled={disabled}
          >
            <Tooltip content="Organization">
              <Avatar className="size-8">
                <AvatarImage src={org?.data?.logo ?? ""} alt="Logo" />
                <AvatarFallback className="bg-sidebar-accent">
                  <Shop />
                </AvatarFallback>
              </Avatar>
            </Tooltip>
          </Button>
        }
      >
        <div className="mb-3 flex flex-col gap-3 rounded-lg border bg-neutral-100/50 p-2">
          <div className="flex items-center gap-2">
            <Avatar className="size-9">
              <AvatarImage src={org?.data?.logo || ""} alt={org?.data?.name} />
              <AvatarFallback>
                <User className="size-4" />
              </AvatarFallback>
            </Avatar>
            <div className="grid min-w-0 flex-1 text-left">
              {orgLoading ? (
                <Skeleton className="h-4 w-24" />
              ) : (
                <span className="truncate font-medium">{org?.data?.name}</span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild size="sm" className="h-7 px-2">
              <Link href="/org/settings/general">
                <Settings className="size-3.5" />
                Settings
              </Link>
            </Button>
            <Button variant="outline" asChild size="sm" className="h-7 px-2">
              <Link href="/settings/members">
                <UserPlus className="size-3.5" />
                Invite members
              </Link>
            </Button>
          </div>
        </div>
        <OrganizationSelector
          selected={org?.data?.id}
          onChange={handleChange}
        />
        <OrgAccess
          permission={{ organization: ["update"] }}
          children={(disabled) => (
            <Button
              variant="ghost"
              className="justify-start pl-3"
              asChild
              disabled={disabled}
            >
              <Link href="/org/settings/new">
                <AddSquare className="size-5" />
                Add New
              </Link>
            </Button>
          )}
        />
      </PopDrawer>
    </SidebarMenuItem>
  )
}
