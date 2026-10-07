"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@jp/ui/components/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@jp/ui/components/command"
import { Tooltip } from "@jp/ui/components/jp/tooltip"
import { MinimalisticMagnifier } from "@solar-icons/react"
import { CRM_NAV, ORG_NAV, SETTINGS_NAV } from "@/lib/constant/config"
import { UserAccess } from "@/features/auth/components/user-permission"
import { useSidebar } from "@jp/ui/components/sidebar"

type NavigationGroup = {
  label: string
  items: {
    label: string
    href: string
    icon: (typeof ORG_NAV)[number]["items"][number]["icon"]
    items: { label: string; href: string }[]
  }[]
}

export function SearchDialog() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const { setOpenMobile } = useSidebar()

  const navigate = (href: string) => {
    setOpen(false)
    setOpenMobile(false)
    router.push(href)
  }

  return (
    <div className="flex flex-col gap-4 pb-4">
      <Tooltip content="Search">
        <Button
          onClick={() => setOpen(true)}
          aria-label="Search app navigation"
          variant="ghost"
          className="hover:bg-background [&>svg]:transition hover:[&>svg]:scale-105"
          size="icon-lg"
        >
          <MinimalisticMagnifier className="size-5" />
        </Button>
      </Tooltip>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="App navigation"
        description="Search and open a page in the admin app."
        className="rounded-3xl! sm:max-w-xl"
      >
        <Command>
          <CommandInput placeholder="Search pages..." />
          <CommandList>
            <CommandEmpty>No pages found.</CommandEmpty>
            <UserAccess permission={{ portal: ["organization"] }}>
              {(disabled) =>
                disabled ? null : (
                  <NavigationItems
                    section="Ordering"
                    groups={ORG_NAV}
                    onNavigate={navigate}
                  />
                )
              }
            </UserAccess>
            <UserAccess permission={{ portal: ["crm"] }}>
              {(disabled) =>
                disabled ? null : (
                  <NavigationItems
                    section="Applications"
                    groups={CRM_NAV}
                    onNavigate={navigate}
                  />
                )
              }
            </UserAccess>
            <UserAccess permission={{ portal: ["organization"] }}>
              {(disabled) =>
                disabled ? null : (
                  <NavigationItems
                    section="Settings"
                    groups={SETTINGS_NAV.filter(
                      (group) => group.label === "Organization"
                    )}
                    onNavigate={navigate}
                  />
                )
              }
            </UserAccess>
            <UserAccess permission={{ user: ["list"] }}>
              {(disabled) =>
                disabled ? null : (
                  <NavigationItems
                    section="Settings"
                    groups={SETTINGS_NAV.filter(
                      (group) => group.label === "Users"
                    )}
                    onNavigate={navigate}
                  />
                )
              }
            </UserAccess>
            <NavigationItems
              section="Settings"
              groups={SETTINGS_NAV.filter((group) => group.label === "Account")}
              onNavigate={navigate}
            />
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  )
}

function NavigationItems({
  section,
  groups,
  onNavigate,
}: {
  section: string
  groups: NavigationGroup[]
  onNavigate: (href: string) => void
}) {
  return groups.map((group) => (
    <CommandGroup
      key={group.label || section}
      heading={[section, group.label].filter(Boolean).join(" · ")}
    >
      {group.items.flatMap(({ label, href, icon: Icon, items }) => {
        const destinations = items.length
          ? items.map((item) => ({ ...item, parent: label }))
          : [{ label, href, parent: "" }]
        return destinations
          .filter((item) => item.href.startsWith("/"))
          .map((item) => (
            <CommandItem
              key={item.href}
              value={item.href}
              keywords={[section, group.label, item.parent, item.label]}
              onSelect={() => onNavigate(item.href)}
            >
              <Icon />
              <span>
                {[item.parent, item.label].filter(Boolean).join(" · ")}
              </span>
            </CommandItem>
          ))
      })}
    </CommandGroup>
  ))
}
