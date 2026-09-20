"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { MenuDots, PenNewRound, TrashBinTrash } from "@solar-icons/react"
import { CircleCheck, CircleOff } from "lucide-react"

import { Button } from "@jp/ui/components/button"
import { PopDrawer } from "@jp/ui/components/jp/pop-drawer"
import { useConfirm } from "@jp/ui/components/jp/confirm-dialog"
import { OrgAccess } from "@/features/auth/components/org-permission"

import type { Promotion } from "../promotion.type"
import { deletePromotion, updatePromotionStatus } from "../promotion.action"

export const PromotionDropdown = ({ data }: { data: Promotion }) => {
  const { open } = useConfirm()
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)

  const nextStatus = data.status === "active" ? "inactive" : "active"

  const invalidatePromotions = () => {
    queryClient.invalidateQueries({ queryKey: ["promotions"] })
    queryClient.invalidateQueries({
      queryKey: ["/org/promotions/count"],
    })
  }

  const handleStatusChange = async () => {
    const isActive = data.status === "active"

    open({
      variant: isActive ? "warning" : "default",
      title: isActive
        ? "Mark this promotion as inactive?"
        : "Mark this promotion as active?",
      description: isActive
        ? "This promotion will stop appearing for customers until it's marked active again."
        : "This promotion will become visible to customers again.",
      action: {
        label: isActive ? "Mark inactive" : "Mark active",
        action: async () => {
          const { serverError } = await updatePromotionStatus({
            id: data.id,
            status: nextStatus,
          })

          if (serverError) {
            toast.error(serverError.message)
          } else {
            toast.success(
              isActive
                ? "Promotion marked as inactive."
                : "Promotion marked as active."
            )
            setIsOpen(false)
            invalidatePromotions()
          }
        },
      },
    })
  }

  const handleDelete = () => {
    open({
      variant: "destructive",
      title: "Delete this promotion?",
      description:
        "This promotion will be permanently deleted and no longer appear for customers.",
      action: {
        label: "Delete",
        action: async () => {
          const { serverError } = await deletePromotion({ id: data.id })
          if (serverError) {
            toast.error(serverError.message)
          } else {
            invalidatePromotions()
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
      <OrgAccess permission={{ promotion: ["update"] }}>
        {(disabled) => (
          <Button
            variant="ghost"
            className="justify-start"
            disabled={disabled}
            onClick={handleStatusChange}
          >
            {nextStatus === "active" ? <CircleCheck /> : <CircleOff />}
            {nextStatus === "active" ? "Mark Active" : "Mark Inactive"}
          </Button>
        )}
      </OrgAccess>

      <OrgAccess permission={{ promotion: ["update"] }}>
        {(disabled) => (
          <Button
            variant="ghost"
            className="justify-start"
            disabled={disabled}
            asChild
          >
            <Link href={`/org/promotions/${data.id}`}>
              <PenNewRound /> Edit
            </Link>
          </Button>
        )}
      </OrgAccess>

      <OrgAccess permission={{ promotion: ["delete"] }}>
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
