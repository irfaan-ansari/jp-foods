"use client"

import React, { useState } from "react"

import {
  AppDialog,
  AppDialogContent,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogTrigger,
} from "@jp/ui/components/jp/app-dialog"
import { useQueryClient } from "@tanstack/react-query"
import { useActiveTeam } from "@/features/team/team.data"
import { InvitationForm } from "../forms/invitation-form"

export const InvitationDialog = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: activeTeam } = useActiveTeam()

  const handleSuccess = () => {
    setOpen(false)
    queryClient.invalidateQueries({ queryKey: ["invitations"] })
  }

  return (
    <AppDialog open={open} onOpenChange={setOpen}>
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>
      <AppDialogContent className="md:max-w-xl">
        <AppDialogHeader className="data-[slot=drawer-header]:sr-only">
          <AppDialogTitle className="text-base font-bold">
            Invite User
          </AppDialogTitle>
        </AppDialogHeader>
        <InvitationForm
          values={{
            email: "",
            teamId: activeTeam?.data.id ?? "",
            organizationId: activeTeam?.data.organizationId ?? "",
          }}
          onSuccess={handleSuccess}
          onCancel={() => setOpen(false)}
        />
      </AppDialogContent>
    </AppDialog>
  )
}
