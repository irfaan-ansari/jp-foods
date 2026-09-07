"use client"

import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import React, { useState } from "react"
import { authClient } from "@jp/auth/client"
import { Button } from "@jp/ui/components/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@jp/ui/components/field"
import { teamFormSchema, type TeamFormSchema } from "../team.schema"
import { upload } from "@vercel/blob/client"
import { Label } from "@jp/ui/components/label"
import { useAppForm } from "@/hooks/use-app-form"
import { Buildings2, CloudUpload } from "@solar-icons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@jp/ui/components/avatar"
import { useQueryClient } from "@tanstack/react-query"

export const TeamForm = ({
  id,
  defaultValues,
}: {
  id: string
  defaultValues: TeamFormSchema
}) => {
  const [file, setFile] = useState<null | File>(null)
  const queryClient = useQueryClient()
  const { name, phoneNumber, email, logo, street, city, state, zip } =
    defaultValues
  const form = useAppForm({
    defaultValues: {
      name,
      phoneNumber,
      email,
      logo,
      street,
      city,
      state,
      zip,
    },
    validators: {
      onSubmit: teamFormSchema,
    },
    onSubmit: async ({ value }) => {
      const { name, phoneNumber, logo, email, ...metadata } = value

      /** upload logo */
      if (file && file instanceof File) {
        const blob = await upload(`team/${file.name}`, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        })

        if (blob.url) value.logo = blob.url
      }

      const { error } = await authClient.organization.updateTeam({
        teamId: id,
        data: {
          name,
          phoneNumber,
          logo,
          email,
        },
      })
      if (error) toast.error(error?.message)
      else {
        queryClient.invalidateQueries()
        toast.success("Updated...")
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
            This is your account logo.
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
            htmlFor="team-logo"
            className="absolute inset-0 inline-flex items-center justify-center rounded-full bg-background/80 opacity-0 transition group-hover/avatar:opacity-100"
          >
            <input
              type="file"
              className="sr-only"
              id="team-logo"
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
              placeholder="Account name"
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
            <Button
              type="submit"
              className="min-w-36"
              disabled={isSubmitting || !canSubmit}
            >
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
