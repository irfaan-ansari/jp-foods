"use client"

import { toast } from "sonner"
import React, { useState } from "react"
import { Loader2 } from "lucide-react"

import { getAvatarUrl } from "@jp/utils"

import { authClient } from "@jp/auth/client"

import { Button } from "@jp/ui/components/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@jp/ui/components/field"

import { useAppForm } from "@/hooks/use-app-form"
import {
  organizationFormSchema,
  OrganizationFormSchema,
} from "../organization.schema"
import { Avatar, AvatarFallback, AvatarImage } from "@jp/ui/components/avatar"
import { Buildings2, CloudUpload } from "@solar-icons/react"
import { Label } from "@jp/ui/components/label"
import { upload } from "@vercel/blob/client"

export const OrganizationForm = ({
  defaultValues,
  organizationId,
  onSuccess,
}: {
  defaultValues?: OrganizationFormSchema
  organizationId?: string
  onSuccess?: () => void
}) => {
  const [file, setFile] = useState<null | File>(null)

  const form = useAppForm({
    defaultValues: {
      name: defaultValues?.name || "",
      phoneNumber: defaultValues?.phoneNumber || "",
      email: defaultValues?.email || "",
      logo: defaultValues?.logo || "",
      street: defaultValues?.street || "",
      city: defaultValues?.city || "",
      state: defaultValues?.state || "",
      zip: defaultValues?.zip || "",
    },
    validators: {
      onSubmit: organizationFormSchema,
    },
    onSubmit: async ({ value }) => {
      const { name, phoneNumber, logo, email, ...metadata } = value
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")

      const toastId = toast.loading("Please wait...")

      /** upload logo */
      if (file && file instanceof File) {
        toast.loading("Uploading logo...", { id: toastId })
        const blob = await upload(`organization/${file.name}`, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        })

        if (blob.url) value.logo = blob.url
      }
      /** update organization */
      if (organizationId) {
        const { error } = await authClient.organization.update({
          organizationId,
          data: {
            logo,
            name,
            phoneNumber,
            email,
            metadata,
          },
        })

        if (error) {
          toast.error(error.message, { id: toastId })
          return
        }
        toast.success("Updated successfully.", { id: toastId })
        onSuccess?.()
        form.reset()
      }
      /** create organization */
      else {
        const { error } = await authClient.organization.create({
          logo: logo ?? getAvatarUrl(name),
          name,
          slug,
          phoneNumber,
          email,
          metadata,
          keepCurrentActiveOrganization: true,
        })

        if (error) {
          toast.error(error.message, { id: toastId })
        } else {
          toast.success("Created successfully.", { id: toastId })
          onSuccess?.()
          form.reset()
        }
      }
    },
  })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      toast.error("Upload a valid image.")
      return
    }
    setFile(file)
    const url = URL.createObjectURL(file)
    form.setFieldValue("logo", url)
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="rounded-2xl border"
    >
      <div className="flex border-b p-6">
        <Field>
          <FieldLabel className="text-base font-semibold">Logo</FieldLabel>
          <FieldDescription>
            This is your organizatio logo.
            <br />
            Click on the logo to upload a custom one from your files.
          </FieldDescription>
        </Field>
        <Avatar className="relative size-24">
          <form.Subscribe
            selector={(state) => state.values.logo}
            children={(logo) => <AvatarImage src={logo} />}
          />
          <AvatarFallback>
            <Buildings2 className="size-6" />
          </AvatarFallback>
          <Label
            htmlFor="organization-logo"
            className="absolute inset-0 inline-flex items-center justify-center rounded-full bg-background/80 opacity-0 transition group-hover/avatar:opacity-100"
          >
            <input
              type="file"
              className="sr-only"
              id="organization-logo"
              onChange={handleFileChange}
            />
            <CloudUpload className="size-5" />
          </Label>
        </Avatar>
      </div>
      <FieldGroup className="grid grid-cols-2 p-6">
        <form.AppField
          name="name"
          children={(field) => (
            <field.TextField
              label="Name"
              placeholder="Warehouse"
              className="col-span-2"
            />
          )}
        />
        <form.AppField
          name="phoneNumber"
          children={(field) => (
            <field.PhoneField
              label="Phone"
              placeholder="(xxxx)-xxx-xxx"
              className="col-span-2 lg:col-span-1"
            />
          )}
        />
        <form.AppField
          name="email"
          children={(field) => (
            <field.TextField
              label="Email"
              placeholder="name@email.com"
              className="col-span-2 lg:col-span-1"
            />
          )}
        />
        <form.AppField
          name="street"
          children={(field) => (
            <field.TextField
              label="Street"
              placeholder="123 Main St"
              className="col-span-2 lg:col-span-1"
            />
          )}
        />
        <form.AppField
          name="city"
          children={(field) => (
            <field.TextField
              label="City"
              placeholder="New York"
              className="col-span-2 lg:col-span-1"
            />
          )}
        />
        <form.AppField
          name="state"
          children={(field) => (
            <field.TextField
              label="State"
              placeholder="New York"
              className="col-span-2 lg:col-span-1"
            />
          )}
        />
        <form.AppField
          name="zip"
          children={(field) => (
            <field.TextField
              label="Zip"
              placeholder="xxxx"
              className="col-span-2 lg:col-span-1"
            />
          )}
        />
      </FieldGroup>

      <div className="border-t bg-secondary/50 p-6 text-right">
        <form.Subscribe
          selector={({ isSubmitting, canSubmit }) => ({
            isSubmitting,
            canSubmit,
          })}
          children={({ isSubmitting, canSubmit }) => (
            <Button type="submit" disabled={isSubmitting || !canSubmit}>
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Save Changes"
              )}
            </Button>
          )}
        />
      </div>
    </form>
  )
}
