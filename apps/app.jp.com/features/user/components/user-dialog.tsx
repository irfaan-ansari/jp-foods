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
import type { UserFormSchema } from "../user.schema"
import { UserForm } from "../forms/user-form"
import type { User } from "../user.type"

export const UserDialog = ({
  id,
  values,
  callback,
  children,
}: {
  values?: UserFormSchema
  id?: string
  callback?: (user: User) => void
  children: React.ReactNode
}) => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const handleSuccess = (user: User) => {
    setOpen(false)
    callback?.(user)
    queryClient.invalidateQueries({ queryKey: ["users"] })
    queryClient.invalidateQueries({
      queryKey: ["count", "/users/count"],
    })
  }

  return (
    <AppDialog open={open} onOpenChange={setOpen}>
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>
      <AppDialogContent className="md:max-w-2xl">
        <AppDialogHeader className="data-[slot=drawer-header]:sr-only">
          <AppDialogTitle className="text-lg font-bold">
            {id ? "Edit User" : "New User"}
          </AppDialogTitle>
        </AppDialogHeader>
        <UserForm
          id={id}
          values={values}
          onSuccess={handleSuccess}
          onCancel={() => setOpen(false)}
        />
      </AppDialogContent>
    </AppDialog>
  )
}
