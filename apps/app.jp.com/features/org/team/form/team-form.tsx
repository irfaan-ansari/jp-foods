"use client"

import React from "react"
import { Loader2 } from "lucide-react"
import { useAppForm } from "@/hooks/use-app-form"
import { Button } from "@jp/ui/components/button"
import { TeamGeneral } from "./team-general"
import { TeamAccount } from "./team-account"
import { TeamPreview } from "./team-preview"
import { teamDefaultValues, teamSchema } from "../team.schema"
import { TeamPrivateItems } from "./team-private-items"

export const TeamForm = () => {
  const form = useAppForm({
    validators: {
      onBlur: teamSchema,
    },
    defaultValues: teamDefaultValues,
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })
  console.log(form.state.values)
  return (
    <React.Fragment>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <TeamGeneral form={form} />
          <TeamAccount form={form} />
          <TeamPrivateItems form={form} />
        </div>
        <TeamPreview form={form} />
      </div>

      {/* action bar */}
      <form.Subscribe
        selector={(state) => ({
          name: state.values.name,
          isSubmitting: state.isSubmitting,
          isDirty: state.isDirty,
        })}
        children={({ name, isSubmitting, isDirty }) => (
          <div
            className={`sticky bottom-4 z-2 mx-auto mt-auto flex min-h-16 w-full max-w-2xl items-center justify-between gap-4 rounded-2xl border-2 border-background bg-secondary/20 p-3 text-sm shadow-sm ring-1 ring-ring/20 backdrop-blur-2xl ${!isDirty ? "hidden" : null}`}
          >
            <div className="grid min-w-0 flex-1 gap-0.5 truncate font-medium">
              <p className="truncate text-sm font-medium">
                {name || "Company name"}
              </p>
              <p className="text-xs text-muted-foreground">
                You have unsaved changes
              </p>
            </div>

            <Button
              variant="link"
              disabled={isSubmitting}
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button
              size="lg"
              className="w-34"
              disabled={isSubmitting}
              onClick={() => {
                form.handleSubmit()
              }}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Save"}
            </Button>
          </div>
        )}
      />
    </React.Fragment>
  )
}
