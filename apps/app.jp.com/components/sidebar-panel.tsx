"use client"

import React, { createContext } from "react"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "motion/react"

import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { cn } from "@jp/ui/lib/utils"
import { useIsMobile } from "@jp/ui/hooks/use-mobile"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@jp/ui/components/sheet"
import { useSidebar } from "@jp/ui/components/sidebar"

export function useSidebarPanel() {
  const context = React.useContext(SidebarPanelContext)

  if (!context) {
    throw new Error(
      "useSidebarPanel must be used within a SidebarPanelProvider."
    )
  }

  return context
}

type SidebarPanelContextValue = {
  activePanel: string
  setActivePanel: (path: string, redirect: boolean) => void
}
const SidebarPanelContext = createContext<SidebarPanelContextValue | null>(null)

export function SidebarPanelProvider({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const pathname = usePathname()
  const { router } = useRouterStuff()
  const isMobile = useIsMobile(992)
  const { setOpen, setOpenMobile } = useSidebar()
  const [activePanel, setActivePanel] = React.useState("")

  const handlePanelChange = (path: string, redirect: boolean) => {
    setActivePanel(path)
    if (redirect) {
      router.push(path)
    }
    if (isMobile) {
      setOpenMobile(true)
    } else {
      setOpen(true)
    }
  }

  // disable on home
  React.useEffect(() => {
    if (pathname === "/") setOpen(false)
  }, [])

  return (
    <SidebarPanelContext.Provider
      value={{
        activePanel,
        setActivePanel: (path: string, redirect = true) => {
          handlePanelChange(path, redirect)
        },
      }}
      {...props}
    />
  )
}

export const SidebarPanel = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { openMobile, setOpenMobile } = useSidebar()
  const isMobile = useIsMobile()
  const isTab = useIsMobile(992)

  if (!isMobile && isTab) {
    return (
      <React.Fragment>
        <div
          data-slot="sidebar-panel"
          className={cn(
            "h-full w-16 **:data-[slot=sidebar-panel-content]:hidden",
            className
          )}
          {...props}
        >
          {children}
        </div>
        <Sheet {...props} open={openMobile} onOpenChange={setOpenMobile}>
          <SheetContent
            data-sidebar="sidebar"
            data-slot="sidebar"
            data-mobile="true"
            side="left"
            className="w-(--sidebar-width) max-w-[90svw] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Sidebar</SheetTitle>
              <SheetDescription>Displays the mobile sidebar.</SheetDescription>
            </SheetHeader>
            <div className={cn("grid h-full grid-cols-[64px_1fr]", className)}>
              {children}
            </div>
          </SheetContent>
        </Sheet>
      </React.Fragment>
    )
  }

  return (
    <div
      data-slot="sidebar-panel"
      className={cn("grid h-full grid-cols-[64px_1fr]", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export const SidebarPanelIcon = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="sidebar-panel-icon"
      className={cn("flex h-full w-16 flex-col pt-6 pb-2", className)}
      {...props}
    />
  )
}

export const SidebarPanelContent = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="sidebar-panel-content"
      className={cn(
        "w-full overflow-hidden p-2 pl-0 transition-[width] group-data-[state=collapsed]:w-0 lg:w-60",
        className
      )}
      {...props}
    >
      <div className="no-scrollbar size-full overflow-auto rounded-2xl bg-neutral-100">
        <AnimatePresence mode="sync">{children}</AnimatePresence>
      </div>
    </div>
  )
}

export const SidebarPanelMenu = ({
  className,
  children,
  path,
  ...props
}: React.ComponentProps<"div"> & { path?: string }) => {
  const id = React.useId()
  // perform animation here
  const pathname = usePathname()

  const { activePanel, setActivePanel } = useSidebarPanel()

  React.useEffect(() => {
    if (pathname.includes(path as string)) {
      setActivePanel(path as string, false)
    }
  }, [pathname, path])

  if (activePanel !== path) return

  return (
    <motion.div
      key={id + path}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 28,
        duration: 0.25,
      }}
    >
      {children}
    </motion.div>
  )
}
