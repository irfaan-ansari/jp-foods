"use client"
import React from "react"
import { Button } from "@jp/ui/components/button"
import { PopDrawer } from "@jp/ui/components/jp"
import {
  ArrowDown,
  ArrowUp,
  MenuDots,
  PenNewSquare,
  TrashBinMinimalistic,
} from "@solar-icons/react"
import { Plus } from "lucide-react"

export const GuideDropdown = () => {
  const [open, setOpen] = React.useState(false)

  return (
    <PopDrawer
      open={open}
      setOpen={setOpen}
      trigger={
        <Button size="icon-sm" variant="outline" className="relative z-1">
          <MenuDots />
        </Button>
      }
      className="*:data-[slot=button]:justify-start"
    >
      <Button variant="ghost">
        <Plus /> Add Items
      </Button>
      <Button variant="ghost">
        <ArrowUp /> Move Up
      </Button>
      <Button variant="ghost">
        <ArrowDown /> Move Down
      </Button>
      <Button variant="ghost">
        <PenNewSquare /> Rename
      </Button>
      <Button variant="destructive" className="bg-transparent">
        <TrashBinMinimalistic /> Delete
      </Button>
    </PopDrawer>
  )
}
