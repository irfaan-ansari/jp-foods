"use client"

import { toast } from "sonner"
import { useState } from "react"
import { Button } from "@jp/ui/components/button"
import { PopDrawer } from "@jp/ui/components/jp/pop-drawer"
import { useQueryClient } from "@tanstack/react-query"

import { useConfirm } from "@jp/ui/components/jp/confirm-dialog"
import { MenuDots, User, UserMinus } from "@solar-icons/react"
import { authClient } from "@jp/auth/client"
import { OrgAccess } from "@/features/auth/components/org-permission"
import { Member } from "../member.type"
import { MemberRoleDialog } from "./member-role-dialog"

export const MemberDropdown = ({ data }: { data: Member }) => {
  const { id } = data
  const { open } = useConfirm()
  const queryClient = useQueryClient()

  const [isOpen, setIsOpen] = useState(false)

  const handleRemove = () => {
    open({
      variant: "warning",
      title: "Remove member?",
      description:
        "This member will no longer be able to access the organization.",
      action: {
        label: "Remove",
        action: async () => {
          const { error } = await authClient.organization.removeMember({
            memberIdOrEmail: data.id,
          })
          if (error) {
            toast.error(error.message)
          } else {
            queryClient.invalidateQueries({ queryKey: ["members"] })
            queryClient.invalidateQueries({
              queryKey: ["/api/v1/org/members/count"],
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
      <OrgAccess permission={{ member: ["update"] }}>
        {(disabled) => (
          <MemberRoleDialog id={id}>
            <Button
              variant="ghost"
              className="justify-start"
              disabled={disabled}
            >
              <User /> Change Role
            </Button>
          </MemberRoleDialog>
        )}
      </OrgAccess>

      <OrgAccess permission={{ member: ["delete"] }}>
        {(disabled) => (
          <Button
            variant="ghost"
            className="hover:bg-destructive/10 hover:text-destructive"
            onClick={handleRemove}
            disabled={disabled}
          >
            <UserMinus /> Remove Member
          </Button>
        )}
      </OrgAccess>
    </PopDrawer>
  )
}
