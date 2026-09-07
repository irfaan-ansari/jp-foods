import React from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useAppForm } from "@/hooks/use-app-form"
import { Button } from "@jp/ui/components/button"
import { Field, FieldGroup } from "@jp/ui/components/field"
import { createGuide } from "../guide.action"
import { GuideSchema } from "../guide.schema"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@jp/ui/components/avatar"
import { Tag } from "@solar-icons/react"
import { pluralize } from "@jp/utils"

export const GuideForm = ({
  id,
  values,
  onSuccess,
  onError,
  onCancel,
}: {
  id?: string
  values?: GuideSchema
  onSuccess?: () => void
  onError?: () => void
  onCancel?: () => void
}) => {
  const { name = "", description = "", productIds = [] } = values ?? {}

  const form = useAppForm({
    defaultValues: {
      name,

      description,
      productIds,
    },

    onSubmit: async ({ value }) => {
      const { data, serverError } = await createGuide({
        data: value,
      })

      if (!data?.success) toast.error(serverError?.message)
      else {
        toast.success("Order guide saved successfully.")
      }
    },
  })

  return (
    <FieldGroup className="-mx-px px-px">
      <div className="flex w-full items-center gap-3 rounded-xl border bg-neutral-50 p-2">
        <Avatar size="lg" className="rounded-lg **:rounded-lg">
          <AvatarFallback>
            <Tag className="size-5 text-sky-500" />
          </AvatarFallback>
        </Avatar>
        <div className="grid min-w-0 flex-1">
          <span className="font-medium">Products</span>
          <span className="text-sm text-muted-foreground">
            {pluralize(productIds.length, `${productIds.length} product`)}
            included in this order guide.
          </span>
        </div>
      </div>
      <form.AppField
        name="name"
        children={(field) => (
          <field.TextField label="Name" placeholder="Weekly essentials" />
        )}
      />
      <form.AppField
        name="description"
        children={(field) => (
          <field.TextAreaField
            label="Description"
            placeholder="List of products for weekly restocking."
          />
        )}
      />
      <Field className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-4 sm:[&>*]:w-28">
        <Button variant="outline" onClick={() => onCancel?.()}>
          Cancel
        </Button>

        <form.Subscribe
          selector={({ isSubmitting, canSubmit }) => ({
            isSubmitting,
            canSubmit,
          })}
          children={({ isSubmitting }) => (
            <Button disabled={isSubmitting} onClick={() => form.handleSubmit()}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Save"}
            </Button>
          )}
        />
      </Field>
    </FieldGroup>
  )
}
