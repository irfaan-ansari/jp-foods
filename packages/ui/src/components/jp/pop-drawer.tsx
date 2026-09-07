"use client"

import { Drawer as DrawerPrimitive } from "vaul"
import { Popover as PopoverPrimitive } from "radix-ui"
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@jp/ui/components/popover"
import { cn } from "@jp/ui/lib/utils"
import { useIsMobile } from "@jp/ui/hooks/use-mobile"
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@jp/ui/components/drawer"

interface Props {
  title?: string
  trigger: React.ReactNode
  children: React.ReactNode
  className?: string
  open: boolean
  setOpen: (v: boolean) => void
}

type PopDrawerProps = Props &
  React.ComponentProps<typeof PopoverPrimitive.Content> &
  React.ComponentProps<typeof DrawerPrimitive.Content> & {
    modal?: boolean
  }

export const PopDrawer = ({
  title,
  trigger,
  children,
  className,
  open,
  setOpen,
  modal = false,
  ...props
}: PopDrawerProps) => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent
          {...props}
          className={cn("justify-start px-4 pt-2 pb-6", className)}
        >
          <DrawerTitle className="hidden">
            {title ?? "Dropdown menu"}
          </DrawerTitle>
          {children}
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen} {...props} modal={modal}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        {...props}
        className={cn(
          "w-[max(var(--radix-popover-trigger-width),192px)] gap-0 rounded-2xl p-2",
          className
        )}
        align="end"
      >
        <PopoverTitle className="hidden">{title ?? "Popover"}</PopoverTitle>

        {children}
      </PopoverContent>
    </Popover>
  )
}
