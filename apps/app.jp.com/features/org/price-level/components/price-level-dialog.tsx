"use client"

import React, { useState } from "react"

import {
  AppDialog,
  AppDialogContent,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogTrigger,
} from "@jp/ui/components/jp/app-dialog"
import { PriceLevelForm } from "../forms/price-level-form"
import { useQueryClient } from "@tanstack/react-query"
import type { PriceLevelFormSchema } from "../price-level.schema"

export const PriceLevelDialog = ({
  values,
  id,
  children,
}: {
  values?: PriceLevelFormSchema
  id?: number
  children: React.ReactNode
}) => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const handleSuccess = () => {
    setOpen(false)
    queryClient.invalidateQueries({ queryKey: ["price-levels"] })
    queryClient.invalidateQueries({
      queryKey: ["count", "/api/v1/org/price-levels/count"],
    })
  }

  return (
    <AppDialog open={open} onOpenChange={setOpen}>
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>
      <AppDialogContent className="md:max-w-2xl">
        <AppDialogHeader className="data-[slot=drawer-header]:sr-only">
          <AppDialogTitle className="text-lg font-bold">
            {id ? "Edit Price Level" : "New Price Level"}
          </AppDialogTitle>
        </AppDialogHeader>
        <PriceLevelForm
          id={id}
          values={values}
          onSuccess={handleSuccess}
          onCancel={() => setOpen(false)}
        />
      </AppDialogContent>
    </AppDialog>
  )
}
