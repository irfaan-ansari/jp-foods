"use client"
import React from "react"
import { PageContent, PageHeader } from "@/components/page-content"
import { SETTINGS_NAV } from "@/features/shared/shared.utils"
import { Button } from "@jp/ui/components/button"
import Link from "next/link"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useRouterStuff()
  return (
    <React.Fragment>
      <PageHeader title="Settings" />
      <PageContent className="mx-auto max-w-5xl space-y-6">
        <div className="flex gap-1 rounded-2xl border bg-neutral-50 p-1 **:flex-1">
          {SETTINGS_NAV.map((nav) => (
            <Button
              asChild
              variant={nav.href === pathname ? "outline" : "ghost"}
              className="hover:bg-background"
            >
              <Link href={nav.href}>{nav.label}</Link>
            </Button>
          ))}
        </div>
        {children}
      </PageContent>
    </React.Fragment>
  )
}

export default SettingsLayout
