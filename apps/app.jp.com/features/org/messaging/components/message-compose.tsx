"use client"

import React from "react"
import { ChevronDown, Loader2, Plus, Send } from "lucide-react"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"

import { useAppForm } from "@/hooks/use-app-form"
import { Button } from "@jp/ui/components/button"
import { Badge } from "@jp/ui/components/badge"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@jp/ui/components/field"
import { TeamSelector } from "@/features/org/team/components/team-selector"
import { sendBulkMessage } from "../messaging.action"
import { SendMessageFormValues, sendMessageSchema } from "../messaging.schema"
import type { MessageRecipientDraft } from "../messaging.type"
import {
  AppDialog,
  AppDialogContent,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogTrigger,
} from "@jp/ui/components/jp"
import { InputGroup, InputGroupTextarea } from "@jp/ui/components/input-group"

const defaults: SendMessageFormValues = {
  name: "",
  message: "",
  manualNumbers: "",
  teams: [],
}

export const MessageComposeDialog = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const queryClient = useQueryClient()
  const [open, setOpen] = React.useState(false)

  const form = useAppForm({
    defaultValues: defaults,
    validators: { onChange: sendMessageSchema },
    onSubmit: async ({ value }) => {
      const payload = { ...value, teamIds: value.teams.map((item) => item.id) }
      const result = await sendBulkMessage({ data: payload })
      if (result.serverError) {
        toast.error(result.serverError.message)
        return
      }
      if (result.validationErrors) {
        toast.error("Check the message values.")
        return
      }
      toast.success(
        `Sending messages to ${result.data?.recipientCount ?? 0} recipient(s).`
      )
      setOpen(false)
      form.reset(defaults)
      queryClient.invalidateQueries({ queryKey: ["message-campaigns"] })
    },
  })

  return (
    <AppDialog open={open} onOpenChange={setOpen}>
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>
      <AppDialogContent className="sm:max-w-2xl">
        <AppDialogHeader>
          <AppDialogTitle className="text-base font-bold">
            Compose Message
          </AppDialogTitle>
        </AppDialogHeader>

        <div className="-mx-1 no-scrollbar max-h-132 overflow-y-auto px-1">
          <FieldGroup>
            <form.AppField
              name="name"
              children={(field) => (
                <field.TextField label="Campaign Name" placeholder="Campaign" />
              )}
            />
            <form.Field
              name="message"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field>
                    <FieldLabel>Message</FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="min-h-28 resize-none"
                        placeholder="Hi user..."
                      />
                    </InputGroup>

                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
            <form.AppField
              name="manualNumbers"
              children={(field) => (
                <field.TextAreaField
                  label="Manual Phone Numbers"
                  placeholder="+15551234567, +15557654321"
                  description="Separate phone numbers with commas."
                />
              )}
            />
            <div className="space-y-4">
              <form.Field
                name="teams"
                mode="array"
                children={(field) => (
                  <RecipientSelector
                    label="Customers"
                    items={field.state.value}
                    onRemove={(index) => field.removeValue(index)}
                    selector={
                      <TeamSelector
                        selected={field.state.value.map((item) => item.id!)}
                        setSelectedChange={(team) => {
                          const index = field.state.value.findIndex(
                            (item) => item.id === team.id
                          )
                          if (index >= 0) field.removeValue(index)
                          else {
                            field.pushValue({
                              id: team.id,
                              name: team.name,
                              phoneNumber: "",
                              source: "team",
                            })
                          }
                        }}
                      >
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-start text-muted-foreground"
                        >
                          <Plus />
                          <span className="flex-1 text-left">
                            Select customers
                          </span>
                          {field.state.value.length > 0 && (
                            <Badge variant="primary-light">
                              {field.state.value.length}
                            </Badge>
                          )}
                          <ChevronDown className="ml-auto" />
                        </Button>
                      </TeamSelector>
                    }
                  />
                )}
              />
            </div>
          </FieldGroup>
        </div>
        <form.Subscribe
          selector={(state) => state.isSubmitting}
          children={(isSubmitting) => (
            <div className="flex justify-end lg:col-span-2">
              <Button
                size="lg"
                disabled={isSubmitting}
                onClick={() => form.handleSubmit()}
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Send />}
                Send Message
              </Button>
            </div>
          )}
        />
      </AppDialogContent>
    </AppDialog>
  )
}

const RecipientSelector = ({
  label,
  items,
  selector,
  onRemove,
}: {
  label: string
  items: MessageRecipientDraft[]
  selector: React.ReactNode
  onRemove: (index: number) => void
}) => (
  <Field>
    <FieldLabel>{label}</FieldLabel>
    {selector}
    {items.length > 0 ? (
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, index) => (
          <Badge
            key={item.id}
            variant="outline"
            className="h-7 gap-1 rounded-lg bg-secondary/50 px-2.5"
          >
            {item.name}
            <button
              type="button"
              className="hover:text-destructive"
              onClick={() => onRemove(index)}
            >
              x
            </button>
          </Badge>
        ))}
      </div>
    ) : (
      <FieldDescription>No recipients selected</FieldDescription>
    )}
  </Field>
)
