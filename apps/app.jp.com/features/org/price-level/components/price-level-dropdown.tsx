"use client"

import { toast } from "sonner"
import { useState } from "react"
import { Button } from "@jp/ui/components/button"
import { PopDrawer } from "@jp/ui/components/jp/pop-drawer"
import { useQueryClient } from "@tanstack/react-query"

import { useConfirm } from "@jp/ui/components/jp/confirm-dialog"
import { MenuDots, PenNewRound, TrashBinTrash } from "@solar-icons/react"
import { OrgAccess } from "@/features/auth/components/org-permission"
import type { PriceLevel } from "../price-level.type"
import { deletePriceLevel } from "../price-level.action"
import { PriceLevelDialog } from "./price-level-dialog"

export const PriceLevelDropdown = ({ data }: { data: PriceLevel }) => {
  const { open } = useConfirm()
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
  const { id } = data

  const handleDelete = () => {
    open({
      variant: "destructive",
      title: "Delete price level?",
      description:
        "This price level will be permanently deleted and can no longer be used.",
      action: {
        action: async () => {
          const { serverError } = await deletePriceLevel({ id })
          if (serverError) {
            toast.error(serverError.message)
          } else {
            queryClient.invalidateQueries({ queryKey: ["price-levels"] })
            queryClient.invalidateQueries({
              queryKey: ["/org/price-levels/count"],
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
      <OrgAccess permission={{ priceLevel: ["update"] }}>
        {(disabled) => (
          <PriceLevelDialog
            id={id}
            values={{
              ...data,
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
          </PriceLevelDialog>
        )}
      </OrgAccess>

      <OrgAccess permission={{ priceLevel: ["delete"] }}>
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
