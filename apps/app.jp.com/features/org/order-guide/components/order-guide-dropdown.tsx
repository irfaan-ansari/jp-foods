"use client"

import { toast } from "sonner"
import { useState } from "react"
import { Button } from "@jp/ui/components/button"
import { PopDrawer } from "@jp/ui/components/jp/pop-drawer"
import { useQueryClient } from "@tanstack/react-query"

import { useConfirm } from "@jp/ui/components/jp/confirm-dialog"
import { MenuDots, PenNewRound, TrashBinTrash } from "@solar-icons/react"
import { OrgAccess } from "@/features/auth/components/org-permission"
import type { OrderGuide } from "../order-guide.type"
import { OrderGuideDialog } from "./order-guide-dialog"
import { deleteOrderGuide } from "../order-guide.action"

export const OrderGuideDropdown = ({ data }: { data: OrderGuide }) => {
  const { open } = useConfirm()
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
  const { id } = data

  const handleDelete = () => {
    open({
      variant: "destructive",
      title: "Delete this order guide?",
      description:
        "This order guide will be permanently deleted and can no longer be used.",
      action: {
        label: "Delete",
        action: async () => {
          const { serverError } = await deleteOrderGuide({ id })
          if (serverError) {
            toast.error(serverError.message)
          } else {
            queryClient.invalidateQueries({ queryKey: ["order-guides"] })
            queryClient.invalidateQueries({
              queryKey: ["/org/order-guides/count"],
            })
          }
        },
      },
    })
  }

  return (
    <PopDrawer
      open={isOpen}
      setOpen={setIsOpen}
      trigger={
        <Button size="icon-sm" variant="outline" className="relative z-1">
          <MenuDots />
        </Button>
      }
      className="*:data-[slot=button]:justify-start"
    >
      <OrgAccess permission={{ orderGuide: ["update"] }}>
        {(disabled) => (
          <OrderGuideDialog
            id={id}
            values={{
              name: data.name,
              description: data.description!,
              team: data.team!,
              products: data.products,
            }}
          >
            <Button
              variant="ghost"
              className="justify-start"
              disabled={disabled}
            >
              <PenNewRound /> Edit
            </Button>
          </OrderGuideDialog>
        )}
      </OrgAccess>

      <OrgAccess permission={{ orderGuide: ["delete"] }}>
        {(disabled) => (
          <Button
            variant="ghost"
            className="hover:bg-destructive/10 hover:text-destructive"
            onClick={handleDelete}
            disabled={disabled}
          >
            <TrashBinTrash /> Delete
          </Button>
        )}
      </OrgAccess>
    </PopDrawer>
  )
}
