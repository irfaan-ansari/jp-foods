"use client"

import { Loader } from "lucide-react"
import { Button } from "@jp/ui/components/button"

import { Textarea } from "@jp/ui/components/textarea"
import { Field, FieldError, FieldLabel } from "@jp/ui/components/field"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createInvite } from "@/features/contact/contact.action"

import { CONTACT_SCHEMA } from "../contact.schema"
import { useAppForm } from "@/hooks/use-app-form"
import { useConfirm } from "@jp/ui/components/jp/confirm-dialog"
import { BUSINESS_TYPES } from "@/features/apply/customer.const"

export const ContactForm = () => {
  const router = useRouter()
  const { open } = useConfirm()

  const form = useAppForm({
    defaultValues: {
      name: "",
      companyName: "",
      companyType: "",
      email: "",
      phone: "",
      message: "",
    },
    onSubmit: async ({ value }) => {
      const res = await createInvite(value)

      if (!res.success) {
        toast.error(res.error.message)
        return
      }

      open({
        title: "Application Submitted",
        description: `Your application has been successfully submitted and is now under review.`,
        action: {
          label: "Back to home",
          action: () => router.push("/"),
        },
      })
      form.reset()
    },
    validators: {
      onChange: CONTACT_SCHEMA,
    },
  })

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <form.AppField
        name="name"
        children={(field) => {
          return <field.TextField label="Name" placeholder="Enter name" />
        }}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <form.AppField
          name="companyName"
          children={(field) => {
            return (
              <field.TextField
                label="Business Name"
                placeholder="Enter business name"
              />
            )
          }}
        />
        <form.AppField
          name="companyType"
          children={(field) => (
            <field.SelectField
              label="Business Type"
              placeholder="Select business type"
              options={BUSINESS_TYPES}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <form.AppField
          name="email"
          children={(field) => {
            return <field.TextField label="Email" placeholder="Enter email" />
          }}
        />
        <form.AppField
          name="phone"
          children={(field) => {
            return <field.TextField label="Phone" placeholder="Enter phone" />
          }}
        />
      </div>
      <form.Field
        name="message"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid} className="gap-2">
              <FieldLabel htmlFor={field.name}>Message</FieldLabel>

              <Textarea
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Type here...."
                rows={6}
                className="min-h-24 resize-none"
                aria-invalid={isInvalid}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )
        }}
      />
      <form.Subscribe
        selector={({ isSubmitting, canSubmit }) => ({
          isSubmitting,
          canSubmit,
        })}
      >
        {({ isSubmitting, canSubmit }) => (
          <Button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            size="xl"
            className="min-w-40 self-end"
          >
            {isSubmitting && <Loader className="animate-spin" />}
            Submit
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
