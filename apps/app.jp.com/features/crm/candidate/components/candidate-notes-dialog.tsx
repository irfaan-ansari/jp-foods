"use client"

import React from "react"
import {
  AppDialog,
  AppDialogClose,
  AppDialogContent,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogTrigger,
} from "@jp/ui/components/jp"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Field } from "@jp/ui/components/field"
import { useAppForm } from "@/hooks/use-app-form"
import { Button } from "@jp/ui/components/button"
import { useQueryClient } from "@tanstack/react-query"
import { updateCandidateApplication } from "../candidate.action"
import { CandidateApplication } from "../candidate.type"

export const CandidateApplicationNotesDialog = ({
  id,
  data,
  children,
}: {
  children: React.ReactNode
  id: number
  data: CandidateApplication
}) => {
  const queryClient = useQueryClient()
  const [open, setOpen] = React.useState(false)

  const form = useAppForm({
    defaultValues: {
      internalNotes: data.internalNotes ?? "",
    },
    onSubmit: async ({ value }) => {
      const { serverError } = await updateCandidateApplication({
        id,
        data: {
          status: data.status,
          statusDetails: data.statusDetails ?? "",
          statusReason: data.statusReason ?? "",
          internalNotes: value.internalNotes,
        },
      })
      if (serverError) {
        toast.error(serverError.message)
      } else {
        setOpen(false)
        queryClient.invalidateQueries({
          queryKey: ["candidate-application"],
        })
      }
    },
  })

  return (
    <AppDialog open={open} onOpenChange={setOpen}>
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>
      <AppDialogContent className="md:max-w-xl">
        <AppDialogHeader className="data-[slot=drawer-header]:sr-only">
          <AppDialogTitle className="text-base font-bold">
            {data.internalNotes ? "Edit" : "Add"} Notes
          </AppDialogTitle>
        </AppDialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="space-y-6"
        >
          <form.AppField
            name="internalNotes"
            children={(field) => (
              <field.TextAreaField label="" placeholder="Notes..." />
            )}
          />

          <Field className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-4 sm:[&>*]:w-28">
            <AppDialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </AppDialogClose>

            <form.Subscribe
              selector={({ isSubmitting, canSubmit }) => ({
                isSubmitting,
                canSubmit,
              })}
              children={({ isSubmitting }) => (
                <Button
                  disabled={isSubmitting}
                  onClick={() => form.handleSubmit()}
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Save"}
                </Button>
              )}
            />
          </Field>
        </form>
      </AppDialogContent>
    </AppDialog>
  )
}
