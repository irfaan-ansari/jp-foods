"use client"

import { ComponentType, useId } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@jp/ui/components/sidebar"
import { AuthType } from "@jp/auth"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@jp/ui/components/collapsible"
import {
  Widget,
  Routing2,
  Settings,
  AltArrowRight,
  CompassSquare,
  QuestionCircle,
} from "@solar-icons/react"
import Link from "next/link"
import React from "react"
import {
  CRM_NAV,
  FLEET_NAV,
  ORG_NAV,
  SETTINGS_NAV,
} from "@/lib/constant/config"
import {
  SidebarPanel,
  SidebarPanelContent,
  SidebarPanelIcon,
  SidebarPanelMenu,
  SidebarPanelProvider,
  useSidebarPanel,
} from "./sidebar-panel"
import { SearchDialog } from "./search-dialog"
import { Button } from "@jp/ui/components/button"
import { Tooltip } from "@jp/ui/components/jp/tooltip"
import { UserProfileDropdown } from "@/features/user/components/user-profile-dropdown"
import { OrganizationSwitcher } from "@/features/org/components/organization-swither"
import { UserAccess } from "@/features/auth/components/user-permission"
import { useOrganization } from "@/features/org/organization.data"

type MenuIcon = ComponentType<{ className?: string }>

export function AppSidebar({ session }: { session: AuthType }) {
  const { data: org, isPending: orgLoading } = useOrganization()

  return (
    <Sidebar
      collapsible="icon"
      variant="inset"
      className="p-0 md:w-16 lg:w-(--sidebar-width)"
    >
      <SidebarPanelProvider>
        <SidebarPanel>
          <SidebarPanelIcon>
            <SidebarIconMenu session={session} />
          </SidebarPanelIcon>

          <SidebarPanelContent>
            {/* organization nav */}
            <SidebarPanelMenu path="/org">
              <SidebarHeader className="px-4.5 pt-4">
                <span className="flex items-center gap-2 rounded-lg text-lg font-bold">
                  {org?.data?.name}
                </span>
              </SidebarHeader>
              <SidebarContent className="gap-0">
                {ORG_NAV.map((group) => {
                  const { label, items } = group
                  return (
                    <SidebarGroup key={label}>
                      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
                      <SidebarMenu>
                        {items.map((item) => {
                          const { label, href, icon, items } = item
                          return (
                            <MenuButton
                              key={label + href}
                              label={label}
                              href={href}
                              icon={icon}
                              subItems={items}
                            />
                          )
                        })}
                      </SidebarMenu>
                    </SidebarGroup>
                  )
                })}
              </SidebarContent>
            </SidebarPanelMenu>

            {/* application nav */}
            <SidebarPanelMenu path="/crm">
              <SidebarHeader className="px-4.5 pt-4">
                <span className="flex items-center gap-2 rounded-lg text-lg font-bold">
                  Applications
                </span>
              </SidebarHeader>
              <SidebarContent className="gap-0">
                {CRM_NAV.map((group) => {
                  const { label, items } = group
                  return (
                    <SidebarGroup key={label}>
                      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
                      <SidebarMenu>
                        {items.map((item) => {
                          const { label, href, icon, items } = item

                          return (
                            <MenuButton
                              key={label + href}
                              label={label}
                              href={href}
                              icon={icon}
                              subItems={items}
                            />
                          )
                        })}
                      </SidebarMenu>
                    </SidebarGroup>
                  )
                })}
              </SidebarContent>
            </SidebarPanelMenu>

            {/* fleet nav */}
            <SidebarPanelMenu path="/fleet">
              <SidebarHeader className="px-4.5 pt-4">
                <span className="flex items-center gap-2 rounded-lg text-lg font-bold">
                  Fleet
                </span>
              </SidebarHeader>
              <SidebarContent className="gap-0">
                {FLEET_NAV.map((group) => {
                  const { label, items } = group
                  return (
                    <SidebarGroup key={label}>
                      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
                      <SidebarMenu>
                        {items.map((item) => {
                          const { label, href, icon, items } = item

                          return (
                            <MenuButton
                              key={label + href}
                              label={label}
                              href={href}
                              icon={icon}
                              subItems={items}
                            />
                          )
                        })}
                      </SidebarMenu>
                    </SidebarGroup>
                  )
                })}
              </SidebarContent>
            </SidebarPanelMenu>

            {/* settings nav */}
            <SidebarPanelMenu path="/settings">
              <SidebarHeader className="px-4.5 pt-4">
                <span className="flex items-center gap-2 rounded-lg text-lg font-bold">
                  Settings
                </span>
              </SidebarHeader>
              <SidebarContent className="gap-0">
                {SETTINGS_NAV.map((group) => {
                  const { label, items } = group
                  return (
                    <SidebarGroup key={label}>
                      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
                      <SidebarMenu>
                        {items.map((item) => {
                          const { label, href, icon, items } = item

                          return (
                            <MenuButton
                              key={label + href}
                              label={label}
                              href={href}
                              icon={icon}
                              subItems={items}
                            />
                          )
                        })}
                      </SidebarMenu>
                    </SidebarGroup>
                  )
                })}
              </SidebarContent>
            </SidebarPanelMenu>
          </SidebarPanelContent>
        </SidebarPanel>
      </SidebarPanelProvider>
    </Sidebar>
  )
}

const SidebarIconMenu = ({ session }: { session: AuthType }) => {
  const { activePanel, setActivePanel } = useSidebarPanel()
  const { setOpen } = useSidebar()
  return (
    <React.Fragment>
      <SidebarHeader className="gap-6">
        <span className="inline-flex w-11 items-center justify-center text-base font-black tracking-widest text-primary">
          JP
        </span>

        <UserAccess permission={{ portal: ["organization"] }}>
          {(disabled) => (
            <SidebarMenu>
              <OrganizationSwitcher
                disabled={disabled}
                className="text-center"
              />
            </SidebarMenu>
          )}
        </UserAccess>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="*:text-center">
            {/* search */}
            <SearchDialog />

            {/* ordering */}
            <UserAccess permission={{ portal: ["organization"] }}>
              {(disabled) => (
                <Tooltip content="Ordering">
                  <SidebarMenuItem
                    onClick={() => {
                      if (!disabled) {
                        setActivePanel("/org", false)
                      }
                    }}
                  >
                    <Button
                      variant="ghost"
                      data-active={activePanel === "/org"}
                      disabled={disabled}
                      className="hover:bg-background data-active:bg-background [&>svg]:transition hover:[&>svg]:scale-105 data-active:[&>svg]:scale-105"
                      size="icon-lg"
                      asChild
                    >
                      {disabled ? (
                        <span>
                          <CompassSquare className="size-5" />
                        </span>
                      ) : (
                        <Link href="/org/dashboard">
                          <CompassSquare className="size-5" />
                        </Link>
                      )}
                    </Button>
                  </SidebarMenuItem>
                </Tooltip>
              )}
            </UserAccess>

            {/* application */}
            <UserAccess permission={{ portal: ["crm"] }}>
              {(disabled) => (
                <Tooltip content="Applications">
                  <SidebarMenuItem
                    onClick={() => {
                      if (!disabled) setActivePanel("/crm", false)
                    }}
                  >
                    <Button
                      size="icon-lg"
                      variant="ghost"
                      disabled={disabled}
                      data-active={activePanel === "/crm"}
                      className="hover:bg-background data-active:bg-background [&>svg]:transition hover:[&>svg]:scale-105 data-active:[&>svg]:scale-105"
                      asChild
                    >
                      {disabled ? (
                        <span>
                          <Widget className="size-5" />
                        </span>
                      ) : (
                        <Link href="/crm/dashboard">
                          <Widget className="size-5" />
                        </Link>
                      )}
                    </Button>
                  </SidebarMenuItem>
                </Tooltip>
              )}
            </UserAccess>

            {/* fleet */}
            <Tooltip content="Fleet">
              <SidebarMenuItem>
                <Button
                  variant="ghost"
                  data-active={activePanel === "/fleet"}
                  className="hover:bg-background [&>svg]:transition hover:[&>svg]:scale-105"
                  size="icon-lg"
                  disabled
                >
                  <Routing2 className="size-5" />
                </Button>
              </SidebarMenuItem>
            </Tooltip>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className="*:text-center">
          {/* settings */}
          <Tooltip content="Settings">
            <SidebarMenuItem onClick={() => setActivePanel("/settings", false)}>
              <UserAccess permission={{ portal: ["organization"] }}>
                {(disabled) => (
                  <Button
                    variant="ghost"
                    data-active={activePanel === "/settings"}
                    className="hover:bg-background data-active:bg-background [&>svg]:transition hover:[&>svg]:scale-105 data-active:[&>svg]:scale-105"
                    size="icon-lg"
                    asChild
                  >
                    {disabled ? (
                      <Link href="/settings/account">
                        <Settings className="size-5" />
                      </Link>
                    ) : (
                      <Link href="/org/settings/general">
                        <Settings className="size-5" />
                      </Link>
                    )}
                  </Button>
                )}
              </UserAccess>
            </SidebarMenuItem>
          </Tooltip>
          {/* help */}
          <Tooltip content="Help">
            <SidebarMenuItem>
              <Button
                size="icon-lg"
                variant="ghost"
                disabled
                className="hover:bg-background [&>svg]:transition hover:[&>svg]:scale-105"
              >
                <QuestionCircle className="size-5" />
              </Button>
            </SidebarMenuItem>
          </Tooltip>

          {/* profile */}
          <UserProfileDropdown session={session!} />
        </SidebarMenu>
      </SidebarFooter>
    </React.Fragment>
  )
}

const MenuButton = ({
  label,
  href,
  icon: Icon,
  subItems,
}: {
  label: string
  href: string
  icon: MenuIcon
  subItems: { label: string; href: string }[] | []
}) => {
  const id = useId()
  const { pathname, getQueryString } = useRouterStuff()

  if (subItems.length === 0) {
    return <MenuLink label={label} icon={Icon} href={href} />
  }

  const isOpen = subItems.some(
    (item) => pathname === item.href || pathname.startsWith(item.href)
  )

  const isSubItemActive = (href: string) => href === pathname + getQueryString()

  return (
    <Collapsible defaultOpen={isOpen} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton isActive={isOpen} className="px-2.5">
            <Icon className="size-5" />
            <span>{label}</span>
            <AltArrowRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {subItems.map((item) => (
              <SidebarMenuSubItem key={id}>
                <SidebarMenuSubButton
                  asChild
                  isActive={isSubItemActive(item.href)}
                >
                  <Link href={item.href}>{item.label}</Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

const MenuLink = ({
  label,
  href = "#",
  icon: Icon,
}: {
  label: string
  href?: string
  icon: MenuIcon
}) => {
  const { pathname } = useRouterStuff()

  const isActive =
    href !== "#" && (pathname === href || pathname.startsWith(href))

  return (
    <SidebarMenuItem>
      {href && href !== "#" ? (
        <SidebarMenuButton
          asChild
          isActive={isActive}
          tooltip={label}
          className="px-2.5 transition duration-200"
        >
          <Link href={href}>
            <Icon className="size-5" />
            <span>{label}</span>
          </Link>
        </SidebarMenuButton>
      ) : (
        <SidebarMenuButton
          isActive={isActive}
          tooltip={label}
          disabled
          className="px-2.5 transition duration-200"
        >
          <Icon className="size-5" />
          <span>{label}</span>
        </SidebarMenuButton>
      )}
    </SidebarMenuItem>
  )
}
