import {
  AppDialog,
  AppDialogContent,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogTrigger,
} from "@jp/ui/components/jp"
import React from "react"

export const ChangeEmailForm = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <AppDialog>
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>
      <AppDialogContent className="flex h-[max(520px,60svh)] flex-row gap-0 p-0 md:max-w-2xl">
        <div className="h-full w-1/3 shrink-0 bg-primary/10"></div>
        <div className="p-6">
          <AppDialogHeader>
            <AppDialogTitle className="text-base font-semibold">
              Change Email
            </AppDialogTitle>
          </AppDialogHeader>
        </div>
      </AppDialogContent>
    </AppDialog>
  )
}
