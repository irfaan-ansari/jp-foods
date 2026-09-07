"use client"

import React from "react"
import Link from "next/link"
import { cn } from "@jp/ui/lib/utils"
import { ChevronsUpDown } from "lucide-react"
import { ORDER_NAV } from "../order-form.utils"
import { PopDrawer } from "@jp/ui/components/jp"
import { Button } from "@jp/ui/components/button"
import { SidebarTrigger } from "@jp/ui/components/sidebar"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"

export const OrderPageHeader = ({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) => {
  const { pathname } = useRouterStuff()
  const [open, setOpen] = React.useState(false)

  return (
    <header
      className={cn(
        "sticky top-0 z-2 border-b px-3 backdrop-blur-xl lg:px-6",
        className
      )}
    >
      <div className="flex min-h-16 items-center justify-between gap-4 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <SidebarTrigger />
          <div>
            <PopDrawer
              open={open}
              setOpen={setOpen}
              trigger={
                <Button variant="ghost" className="truncate text-lg font-bold">
                  {ORDER_NAV.find((opt) => opt.href === pathname)?.label}{" "}
                  <ChevronsUpDown />
                </Button>
              }
            >
              {ORDER_NAV.map((opt) => (
                <Button
                  variant="ghost"
                  key={opt.href}
                  className="justify-start"
                  asChild
                >
                  <Link href={opt.href}>
                    {" "}
                    <opt.icon /> {opt.label}
                  </Link>
                </Button>
              ))}
            </PopDrawer>
          </div>
        </div>

        {children && (
          <div className="flex shrink-0 items-center gap-2">{children}</div>
        )}
      </div>
    </header>
  )
}
