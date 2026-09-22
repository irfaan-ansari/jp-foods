"use client"

import Link from "next/link"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@jp/ui/components/collapsible"

import {
  Sidebar,
  SidebarMenu,
  SidebarGroup,
  SidebarContent,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarGroupLabel,
  SidebarFooter,
  SidebarHeader,
} from "@jp/ui/components/sidebar"
import type { AuthType, DeviceSessions } from "@jp/auth"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"

import { AltArrowRight, QuestionCircle, Settings } from "@solar-icons/react"
import { ComponentType } from "react"
import { SIDEBAR_NAV } from "@/lib/constant/nav"
import { UserProfileDropdown } from "@/features/profile/components"
import { TeamSwitcher } from "@/features/team/components"

import { Sparkles } from "lucide-react"
import AiDrawer from "@/features/ai/components/ai-drawer"

type MenuIcon = ComponentType<{ className?: string }>

export function AppSidebar({
  session,
  sessionsList,
}: {
  session: AuthType
  sessionsList: DeviceSessions
}) {
  return (
    <Sidebar
      collapsible="icon"
      variant="inset"
      className="*:data-[slot=sidebar-inner]:rounded-2xl *:data-[slot=sidebar-inner]:bg-neutral-100"
    >
      <SidebarHeader className="gap-4">
        <SidebarMenu className="group-data-[collapsible=icon]:items-center">
          <SidebarMenuItem>
            <TeamSwitcher />
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          <SidebarMenuItem>
            <AiDrawer>
              <SidebarMenuButton className="w-full justify-start">
                <Sparkles className="size-3.5 text-fuchsia-500" />
                <span className="bg-linear-to-r from-fuchsia-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  AI Assistant
                </span>
              </SidebarMenuButton>
            </AiDrawer>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {SIDEBAR_NAV.map((group) => {
          const { label, items } = group
          return (
            <SidebarGroup key={label}>
              {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
              <SidebarMenu>
                {items.map((item) => {
                  const { label, href, icon, items, disabled } = item
                  return (
                    <MenuButton
                      key={label + href}
                      label={label}
                      href={href}
                      icon={icon}
                      subItems={items}
                      disabled={disabled}
                    />
                  )
                })}
              </SidebarMenu>
            </SidebarGroup>
          )
        })}
      </SidebarContent>

      <SidebarFooter className="p-0">
        <SidebarGroup>
          <SidebarMenu>
            <MenuLink icon={Settings} label="Settings" href="/settings" />
            <MenuLink
              icon={QuestionCircle}
              label="Help & Support"
              href="/help"
              disabled={true}
            />
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarMenu className="group-data-[collapsible=icon]:items-center">
            <SidebarMenuItem>
              <UserProfileDropdown
                session={session}
                sessionsList={sessionsList}
              />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  )
}

const MenuButton = ({
  label,
  href,
  icon: Icon,
  subItems,
  disabled = false,
}: {
  label: string
  href: string
  icon: MenuIcon
  subItems: { label: string; href: string }[] | []
  disabled: boolean
}) => {
  const { pathname, getQueryString } = useRouterStuff()

  if (subItems.length === 0) {
    return (
      <MenuLink label={label} icon={Icon} href={href} disabled={disabled} />
    )
  }

  const isOpen = subItems.some(
    (item) => pathname === item.href || pathname.startsWith(item.href)
  )

  const isSubItemActive = (href: string) => href === pathname + getQueryString()

  return (
    <Collapsible defaultOpen={isOpen} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            isActive={isOpen}
            className="px-2.5"
            disabled={disabled}
          >
            <Icon className="size-5" />
            <span>{label}</span>
            <AltArrowRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {subItems.map((item) => (
              <SidebarMenuSubItem key={item.href}>
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
  disabled = false,
}: {
  label: string
  href?: string
  icon: MenuIcon
  disabled?: boolean
}) => {
  const { pathname } = useRouterStuff()

  const isActive =
    href !== "#" && (pathname === href || pathname.startsWith(href))

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={label}
        className={`px-2.5 transition duration-200`}
        disabled={disabled}
      >
        {disabled ? (
          <span className="opacity-60">
            <Icon className="size-5" />
            <span>{label}</span>
          </span>
        ) : (
          <Link href={href}>
            <Icon className="size-5" />
            <span>{label}</span>
          </Link>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
