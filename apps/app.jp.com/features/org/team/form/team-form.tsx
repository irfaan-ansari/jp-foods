"use client"

import React from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useAppForm } from "@/hooks/use-app-form"
import { Button } from "@jp/ui/components/button"
import { TeamGeneral } from "./team-general"
import { TeamAccount } from "./team-account"
import { TeamPreview } from "./team-preview"
import {
  teamDefaultValues,
  type TeamFormValues,
  teamSchema,
} from "../team.schema"
import { TeamPrivateItems } from "./team-private-items"
import { TeamUsers } from "./team-users"
import { createTeam, updateTeam } from "../team.action"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"

export const TeamForm = ({
  id,
  values,
}: {
  id?: string
  values?: TeamFormValues
}) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const form = useAppForm({
    validators: {
      onSubmit: teamSchema,
    },
    defaultValues: values ?? teamDefaultValues,
    onSubmit: async ({ value }) => {
      const { teamMembers, priceLevel, taxRule, salesRep, ...rest } = value
      const payload = {
        ...rest,
        priceLevelId: priceLevel?.id ?? null,
        taxRuleId: taxRule?.id ?? null,
        salesRepId: salesRep?.id ?? null,
        userIds: teamMembers?.map((member) => member.id) || [],
      }

      // update
      if (id) {
        const { validationErrors, serverError } = await updateTeam({
          id,
          data: payload,
        })
        if (validationErrors) {
          toast.error("One or more fields are invalid")
          return
        }
        if (serverError) {
          toast.error(serverError.message)
          return
        }
        toast.success("Account updated.")
        return
      }

      // create
      const { validationErrors, serverError, data } = await createTeam({
        data: payload,
      })

      if (validationErrors) {
        toast.error("One or more fields are invalid")
        return
      }
      if (serverError) {
        toast.error(serverError.message)
        return
      }
      queryClient.invalidateQueries({
        queryKey: ["teams", "team", "analytics"],
      })
      toast.success("Account created.")
      router.push(`/org/customers/${data?.id}`)
    },
  })

  return (
    <React.Fragment>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <TeamGeneral form={form} />
          <TeamAccount form={form} />
          <TeamPrivateItems form={form} />
          <TeamUsers form={form} />
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
