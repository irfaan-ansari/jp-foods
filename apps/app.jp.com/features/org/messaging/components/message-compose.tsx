"use client"

import React from "react"
import { ChevronDown, Loader2, Plus, Send } from "lucide-react"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"

import { useAppForm } from "@/hooks/use-app-form"
import { Button } from "@jp/ui/components/button"
import { Badge } from "@jp/ui/components/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@jp/ui/components/field"
import { TeamSelector } from "@/features/org/team/components/team-selector"
import { UserSelector } from "@/features/user/components/user-selector"
import { MESSAGE_TEMPLATES, MESSAGE_VARIABLES } from "../messaging.const"
import { sendBulkMessage } from "../messaging.action"
import {
  SendMessageFormValues,
  sendMessageSchema,
} from "../messaging.schema"
import type { MessageRecipientDraft } from "../messaging.type"

const defaults: SendMessageFormValues = {
  name: "",
  templateKey: "custom",
  message: "",
  manualNumbers: "",
  teams: [],
  users: [],
}

export const MessageCompose = () => {
  const queryClient = useQueryClient()
  const form = useAppForm({
    defaultValues: defaults,
    validators: { onChange: sendMessageSchema },
    onSubmit: async ({ value }) => {
      const result = await sendBulkMessage({ data: value })
      if (result.serverError) {
        toast.error(result.serverError.message)
        return
      }
      if (result.validationErrors) {
        toast.error("Check the message values.")
        return
      }
      toast.success(
        `Message sent to ${result.data?.sentCount ?? 0} recipient(s).`
      )
      form.reset(defaults)
      queryClient.invalidateQueries({ queryKey: ["message-campaigns"] })
    },
  })

  return (
    <Card size="sm" className="shadow-xs">
      <CardHeader>
        <CardTitle className="font-bold">Compose Message</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup className="grid grid-cols-1 lg:grid-cols-2">
          <form.AppField
            name="name"
            children={(field) => (
              <field.TextField
                label="Campaign Name"
                placeholder="September customer reminder"
              />
            )}
          />
          <form.AppField
            name="templateKey"
            children={(field) => (
              <field.SelectField
                label="Template"
                options={MESSAGE_TEMPLATES.map((template) => ({
                  label: template.label,
                  value: template.key,
                }))}
              />
            )}
          />
          <form.Field
            name="message"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field className="lg:col-span-2">
                  <FieldLabel>Message</FieldLabel>
                  <textarea
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="min-h-36 rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Hi {{name}}, this is {{organizationName}}..."
                  />
                  <FieldDescription>
                    Use variables like {"{{name}}"} or {"{{teamName}}"}.
                  </FieldDescription>
                  <div className="flex flex-wrap gap-1.5">
                    {MESSAGE_VARIABLES.map((variable) => (
                      <Button
                        key={variable.key}
                        size="sm"
                        variant="secondary"
                        type="button"
                        onClick={() =>
                          field.handleChange(
                            `${field.state.value}${field.state.value ? " " : ""}{{${variable.key}}}`
                          )
                        }
                      >
                        {`{{${variable.key}}}`}
                      </Button>
                    ))}
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                description="Separate phone numbers with commas or new lines."
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
                      selected={field.state.value.map((item) => item.teamId!)}
                      setSelectedChange={(team) => {
                        const index = field.state.value.findIndex(
                          (item) => item.teamId === team.id
                        )
                        if (index >= 0) field.removeValue(index)
                        else {
                          field.pushValue({
                            id: `team:${team.id}`,
                            name: team.name,
                            phoneNumber: "",
                            source: "team",
                            teamId: team.id,
                            teamName: team.name,
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
                        Select customers
                        <ChevronDown className="ml-auto" />
                      </Button>
                    </TeamSelector>
                  }
                />
              )}
            />
            <form.Field
              name="users"
              mode="array"
              children={(field) => (
                <RecipientSelector
                  label="Users"
                  items={field.state.value}
                  onRemove={(index) => field.removeValue(index)}
                  selector={
                    <UserSelector
                      selected={field.state.value.map((item) => item.userId!)}
                      setSelectedChange={(user) => {
                        const index = field.state.value.findIndex(
                          (item) => item.userId === user.id
                        )
                        if (index >= 0) field.removeValue(index)
                        else {
                          field.pushValue({
                            id: `user:${user.id}`,
                            name: user.name,
                            phoneNumber: user.phoneNumber,
                            source: "user",
                            userId: user.id,
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
                        Select users
                        <ChevronDown className="ml-auto" />
                      </Button>
                    </UserSelector>
                  }
                />
              )}
            />
          </div>
          <form.Subscribe
            selector={(state) => state.isSubmitting}
            children={(isSubmitting) => (
              <div className="lg:col-span-2 flex justify-end">
                <Button
                  size="lg"
                  disabled={isSubmitting}
                  onClick={() => form.handleSubmit()}
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Send />
                  )}
                  Send Message
                </Button>
              </div>
            )}
          />
        </FieldGroup>
      </CardContent>
    </Card>
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
    {items.length > 0 && (
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, index) => (
          <Badge key={item.id} variant="secondary" className="gap-1">
            {item.name}
            <button type="button" onClick={() => onRemove(index)}>
              x
            </button>
          </Badge>
        ))}
      </div>
    )}
  </Field>
)
