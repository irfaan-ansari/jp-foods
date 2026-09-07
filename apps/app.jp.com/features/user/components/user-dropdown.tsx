"use client"

import { toast } from "sonner"
import { useState } from "react"
import { Button } from "@jp/ui/components/button"
import { PopDrawer } from "@jp/ui/components/jp/pop-drawer"
import { useQueryClient } from "@tanstack/react-query"

import { useConfirm } from "@jp/ui/components/jp/confirm-dialog"
import {
  ShieldUser,
  Key,
  Logout3,
  MenuDots,
  PenNewRound,
  TrashBinTrash,
  UserBlock,
  UserCheckRounded,
} from "@solar-icons/react"
import type { User } from "../user.type"

import { UserDialog } from "./user-dialog"
import { UserAccess } from "@/features/auth/components/user-permission"
import { UserPasswordDialog } from "./user-password-dialog"
import { authClient } from "@jp/auth/client"
import { USER_ROLES } from "../user.const"

export const UserDropdown = ({ data }: { data: User }) => {
  const { id } = data
  const { open } = useConfirm()
  const queryClient = useQueryClient()

  const [isOpen, setIsOpen] = useState(false)

  const roles =
    data.role
      ?.split(",")
      .map((role) => USER_ROLES[role as keyof typeof USER_ROLES]) ?? []

  const handleSessionRevoke = () => {
    open({
      variant: "warning",
      title: "Revoke all sessions?",
      description:
        "The user will be signed out of all active sessions and must sign in again.",
      action: {
        action: async () => {
          const { error } = await authClient.admin.revokeUserSessions({
            userId: id,
          })
          if (error) toast.error(error.message)
        },
      },
    })
  }

  const handleBanUnban = () => {
    open({
      variant: data.banned ? "info" : "warning",
      title: data.banned ? "Unban user?" : "Ban user?",
      description: data.banned
        ? "This user will regain access and be able to sign in again."
        : "This user will no longer be able to sign in until they are unbanned.",
      action: {
        action: async () => {
          const { error } = data.banned
            ? await authClient.admin.unbanUser({
                userId: id,
              })
            : await authClient.admin.banUser({
                userId: id,
              })

          if (error) toast.error(error.message)
          else queryClient.invalidateQueries({ queryKey: ["users"] })
        },
      },
    })
  }

  const handleDelete = () => {
    open({
      variant: "destructive",
      title: "Delete user?",
      description:
        "This user will be permanently deleted. This action cannot be undone.",
      action: {
        action: async () => {
          const { error } = await authClient.admin.removeUser({
            userId: data.id,
          })
          if (error) {
            toast.error(error.message)
          } else {
            queryClient.invalidateQueries({ queryKey: ["users"] })
          }
        },
      },
    })
  }
  const handleImpersonate = async () => {
    open({
      variant: "info",
      title: "Impersonate user?",
      description:
        "You will sign in as this user until you end the impersonation session.",
      action: {
        action: async () => {
          const { error } = await authClient.admin.impersonateUser({
            userId: data.id,
          })
          if (error) toast.error(error.message)
          else window.location.reload()
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
      <UserAccess permission={{ user: ["update"] }}>
        {(disabled) => (
          <UserDialog
            id={id}
            values={{ ...data, phoneNumber: data.phoneNumber!, role: roles }}
          >
            <Button
              variant="ghost"
              className="justify-start"
              disabled={disabled}
            >
              <PenNewRound /> Edit
            </Button>
          </UserDialog>
        )}
      </UserAccess>

      <UserAccess permission={{ user: ["impersonate"] }}>
        {(disabled) => (
          <Button
            variant="ghost"
            onClick={handleImpersonate}
            disabled={disabled}
          >
            <ShieldUser /> Impersonate
          </Button>
        )}
      </UserAccess>
      <UserAccess permission={{ user: ["set-password"] }}>
        {(disabled) => (
          <UserPasswordDialog id={data.id}>
            <Button variant="ghost" disabled={disabled}>
              <Key /> Change Password
            </Button>
          </UserPasswordDialog>
        )}
      </UserAccess>

      <UserAccess permission={{ session: ["revoke"] }}>
        {(disabled) => (
          <Button
            variant="ghost"
            onClick={handleSessionRevoke}
            disabled={disabled}
          >
            <Logout3 /> Revoke Sessions
          </Button>
        )}
      </UserAccess>

      <UserAccess permission={{ user: ["ban"] }}>
        {(disabled) => (
          <Button
            variant="ghost"
            className="hover:bg-warning/10 hover:text-warning"
            disabled={disabled}
            onClick={handleBanUnban}
          >
            {data.banned ? (
              <>
                <UserCheckRounded /> Unban
              </>
            ) : (
              <>
                <UserBlock /> Ban
              </>
            )}
          </Button>
        )}
      </UserAccess>

      <UserAccess permission={{ user: ["delete"] }}>
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
      </UserAccess>
    </PopDrawer>
  )
}
