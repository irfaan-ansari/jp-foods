"use client"

import * as React from "react"
import {
  CalculatorIcon,
  CalendarIcon,
  CreditCardIcon,
  SettingsIcon,
  SmileIcon,
  UserIcon,
} from "lucide-react"

import { Button } from "@jp/ui/components/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@jp/ui/components/command"
import { Tooltip } from "@jp/ui/components/jp/tooltip"
import { MinimalisticMagnifier } from "@solar-icons/react"

export function SearchDialog({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="flex flex-col gap-4 pb-4">
      <Tooltip content="Search">
        <Button
          onClick={() => setOpen(!open)}
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
        className="rounded-3xl! sm:max-w-xl"
      >
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                <CalendarIcon />
                <span>Calendar</span>
              </CommandItem>
              <CommandItem>
                <SmileIcon />
                <span>Search Emoji</span>
              </CommandItem>
              <CommandItem>
                <CalculatorIcon />
                <span>Calculator</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>
                <UserIcon />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <CreditCardIcon />
                <span>Billing</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <SettingsIcon />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  )
}
