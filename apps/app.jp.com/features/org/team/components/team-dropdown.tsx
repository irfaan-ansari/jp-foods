"use client"
import React from "react"
import Link from "next/link"
import {
  PenNewRound,
  TrashBinTrash,
  UserBlockRounded,
  UserCheckRounded,
} from "@solar-icons/react"
import type { Team } from "../team.type"
import { Button } from "@jp/ui/components/button"
import { PopDrawer, useConfirm } from "@jp/ui/components/jp"
import { OrgAccess } from "@/features/auth/components/org-permission"
import { authClient } from "@jp/auth/client"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"

export const TeamDropdown = ({
  data,
  children,
}: {
  data: Team
  children: React.ReactNode
}) => {
  const { open } = useConfirm()
  const queryClient = useQueryClient()

  const [isOpen, setIsOpen] = React.useState(false)

  const handleAction = (action: string) => {
    switch (action) {
      case "active":
        open({
          variant: "default",
          title: "Activate Account",
          description:
            "This will activate the customer account and allow them to use their account normally.",
          action: {
            label: "Activate",
            action: async () => {
              const { error } = await authClient.organization.updateTeam({
                teamId: data.id,
                data: {
                  status: "active",
                },
              })
              if (error) {
                toast.error(error.message)
                return
              }
              queryClient.invalidateQueries({ queryKey: ["teams"] })
              setIsOpen(false)
            },
          },
        })
        break
      case "inactive":
        open({
          variant: "warning",
          title: "Deactivate Account",
          description:
            "This will deactivate the customer account and prevent them from placing orders until the account is activated again.",
          action: {
            label: "Deactivate",
            action: async () => {
              const { error } = await authClient.organization.updateTeam({
                teamId: data.id,
                data: {
                  status: "inactive",
                },
              })
              if (error) {
                toast.error(error.message)
                return
              }
              queryClient.invalidateQueries({ queryKey: ["teams"] })
              setIsOpen(false)
            },
          },
        })
        break
    }
  }

  const handleDelete = () => {
    open({
      variant: "destructive",
      title: "Delete Account",
      description:
        "This will permanently delete the customer account and its associated data. This action cannot be undone.",
      action: {
        label: "Delete",
        action: async () => {
          const { error } = await authClient.organization.removeTeam({
            teamId: data.id,
          })
          if (error) {
            toast.error(error.message)
            return
          }
          queryClient.invalidateQueries({ queryKey: ["teams"] })
          setIsOpen(false)
        },
      },
    })
  }

  return (
    <PopDrawer open={isOpen} setOpen={setIsOpen} trigger={children}>
      <OrgAccess permission={{ team: ["update"] }}>
        {(disabled) => (
          <Button
            variant="ghost"
            className="justify-start"
            asChild
            disabled={disabled}
          >
            <Link href={`/org/customers/${data.id}/edit`}>
              <PenNewRound />
              Edit
            </Link>
          </Button>
        )}
      </OrgAccess>

      {data.status === "active" ? (
        <OrgAccess permission={{ team: ["update"] }}>
          {(disabled) => (
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => handleAction("inactive")}
              disabled={disabled}
            >
              <UserBlockRounded />
              Deactivate Account
            </Button>
          )}
        </OrgAccess>
      ) : (
        <OrgAccess permission={{ team: ["update"] }}>
          {(disabled) => (
            <Button
              variant="ghost"
              className="justify-start"
              disabled={disabled}
              onClick={() => handleAction("active")}
            >
              <UserCheckRounded />
              Activate Account
            </Button>
          )}
        </OrgAccess>
      )}
      <OrgAccess permission={{ team: ["delete"] }}>
        {(disabled) => (
          <Button
            variant="ghost"
            className="justify-start text-destructive hover:text-destructive"
            disabled={disabled}
            onClick={handleDelete}
          >
            <TrashBinTrash />
            Delete
          </Button>
        )}
      </OrgAccess>
    </PopDrawer>
  )
}
