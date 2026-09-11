"use client"

import { toast } from "sonner"
import { useState } from "react"
import { Button } from "@jp/ui/components/button"
import { PopDrawer } from "@jp/ui/components/jp/pop-drawer"
import { useQueryClient } from "@tanstack/react-query"

import { useConfirm } from "@jp/ui/components/jp/confirm-dialog"
import { MenuDots, PenNewRound, TrashBinTrash } from "@solar-icons/react"
import { OrgAccess } from "@/features/auth/components/org-permission"
import type { TaxRule } from "../tax-rule.type"
import { deleteTaxRule } from "../tax-rule.action"
import { TaxRuleDialog } from "./tax-rule-dialog"

export const TaxRuleDropdown = ({ data }: { data: TaxRule }) => {
  const { open } = useConfirm()
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
  const { id } = data

  const handleDelete = () => {
    setIsOpen(false)
    open({
      variant: "destructive",
      title: "Delete tax rule?",
      description:
        "This tax rule will be permanently deleted and can no longer be used.",
      action: {
        action: async () => {
          const { serverError } = await deleteTaxRule({ id })
          if (serverError) {
            toast.error(serverError.message)
          } else {
            queryClient.invalidateQueries({ queryKey: ["tax-rules"] })
            queryClient.invalidateQueries({
              queryKey: ["/org/tax-rules/count"],
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
      <OrgAccess permission={{ taxRule: ["update"] }}>
        {(disabled) => (
          <TaxRuleDialog
            id={id}
            values={{
              ...data,
            }}
          >
            <Button
              variant="ghost"
              className="justify-start"
              disabled={disabled}
            >
              <PenNewRound /> Edit
            </Button>
          </TaxRuleDialog>
        )}
      </OrgAccess>

      <OrgAccess permission={{ taxRule: ["delete"] }}>
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
