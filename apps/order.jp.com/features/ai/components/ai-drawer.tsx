"use client"

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
  DrawerFooter,
  DrawerClose,
} from "@jp/ui/components/drawer"
import { Button } from "@jp/ui/components/button"
import { Input } from "@jp/ui/components/input"
import { Badge } from "@jp/ui/components/badge"
import {
  Bot,
  ArrowUp,
  ShoppingCart,
  PackageSearch,
  RotateCcw,
  Receipt,
  Sparkles,
  ArrowUpIcon,
  Sparkle,
  X,
} from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@jp/ui/components/input-group"
import { Avatar, AvatarFallback } from "@jp/ui/components/avatar"

const suggestions = [
  {
    icon: ShoppingCart,
    title: "Build an order",
    prompt: "Create an order for 120 guests.",
  },
  {
    icon: RotateCcw,
    title: "Restock this week",
    prompt: "Restock based on my previous orders.",
  },
  {
    icon: PackageSearch,
    title: "Find products",
    prompt: "Show halal chicken under £80.",
  },
  {
    icon: Receipt,
    title: "Explain invoice",
    prompt: "Why was my latest invoice higher?",
  },
]

export default function AiDrawer({ children }: { children: React.ReactNode }) {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>{children}</DrawerTrigger>

      <DrawerContent className="gap-4 data-[vaul-drawer-direction=right]:sm:max-w-lg">
        <DrawerHeader className="flex flex-row items-center p-2">
          <DrawerTitle className="font-semibold">AI Assistant</DrawerTitle>
          <DrawerClose asChild>
            <Button size="icon-xs" variant="secondary" className="ml-auto">
              <X />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="no-scrollbar flex h-full flex-1 flex-col justify-center space-y-6 overflow-auto px-2">
          <p className="mb-6 text-center">How can I help you today?</p>
          <div className="flex flex-wrap items-start justify-center gap-2 **:h-7 **:px-2.5">
            <Badge variant="secondary">Help me build an order </Badge>
            <Badge variant="secondary">Where is my order?</Badge>
            <Badge variant="secondary">Reorder my previous purchase</Badge>
            <Badge variant="secondary">Find products for my business </Badge>
            <Badge variant="secondary">Show my unpaid invoices </Badge>
          </div>
        </div>
        <DrawerFooter className="p-2">
          <InputGroup className="bg-neutral-50">
            <InputGroupTextarea placeholder="Hi! I can help you with orders, products, invoices, and account questions.  " />
            <InputGroupAddon align="block-end">
              <InputGroupButton
                type="submit"
                variant="default"
                size="icon-sm"
                className="ml-auto"
              >
                <ArrowUpIcon />
                <span className="sr-only">Send</span>
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
