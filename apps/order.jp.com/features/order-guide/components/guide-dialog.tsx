import React from "react"
import {
  AppDialog,
  AppDialogContent,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogTrigger,
} from "@jp/ui/components/jp/app-dialog"
import { GuideForm } from "../forms/guide-form"
import { GuideSchema } from "../guide.schema"

export const GuideDialog = ({
  children,
  id,
  values,
}: {
  children: React.ReactNode
  id?: number
  values: GuideSchema
}) => {
  const [open, setOpen] = React.useState(false)
  return (
    <AppDialog open={open} onOpenChange={setOpen}>
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>
      <AppDialogContent className="md:max-w-xl">
        <AppDialogHeader className="data-[slot=drawer-header]:sr-only">
          <AppDialogTitle className="text-lg font-bold">
            {id ? "Edit Order Guide" : "New Order Guide"}
          </AppDialogTitle>
        </AppDialogHeader>
        <GuideForm values={values} onCancel={() => setOpen(false)} />
      </AppDialogContent>
    </AppDialog>
  )
}
