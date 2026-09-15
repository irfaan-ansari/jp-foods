"use client"

import Link from "next/link"
import { useState } from "react"
import { OrderSelectType } from "@jp/db"
import { Button } from "@jp/ui/components/button"
import { OrderCancelDialog } from "./order-cancel-dialog"
import { PopDrawer } from "@jp/ui/components/jp/pop-drawer"
import { CloseCircle, MenuDots, PenNewSquare } from "@solar-icons/react"

export const OrderDropdown = ({
  data,
}: {
  data: Pick<OrderSelectType, "id" | "status">
}) => {
  const { id } = data
  const [open, setOpen] = useState(false)

  if (data.status !== "in_progress") return
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
      <Button variant="ghost" asChild>
        <Link href={`/orders/${id}/edit/all`}>
          <PenNewSquare /> Edit
        </Link>
      </Button>

      <OrderCancelDialog id={data.id}>
        <Button variant="destructive" className="justify-start bg-background">
          <CloseCircle /> Cancel
        </Button>
      </OrderCancelDialog>
    </PopDrawer>
  )
}
