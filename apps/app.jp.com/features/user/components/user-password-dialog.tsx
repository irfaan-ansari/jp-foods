"use client"

import React, { useState } from "react"
import {
  AppDialog,
  AppDialogContent,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogTrigger,
} from "@jp/ui/components/jp/app-dialog"
import { UserPasswordForm } from "../forms/user-password-form"

export const UserPasswordDialog = ({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) => {
  const [open, setOpen] = useState(false)

  return (
    <AppDialog open={open} onOpenChange={setOpen}>
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>
      <AppDialogContent className="md:max-w-xl">
        <AppDialogHeader className="data-[slot=drawer-header]:sr-only">
          <AppDialogTitle className="text-lg font-bold">
            New Password
          </AppDialogTitle>
        </AppDialogHeader>
        <UserPasswordForm
          id={id}
          onSuccess={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </AppDialogContent>
    </AppDialog>
  )
}
