"use client"
import { useAppForm } from "@/hooks/use-app-form"
import { profileSchema } from "../profile.schema"
import React from "react"
import { toast } from "sonner"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@jp/ui/components/field"
import { Avatar, AvatarFallback, AvatarImage } from "@jp/ui/components/avatar"
import { Label } from "@jp/ui/components/label"
import { CloudUpload, User, VerifiedCheck } from "@solar-icons/react"
import { Button } from "@jp/ui/components/button"
import { Loader2 } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@jp/ui/components/input-group"
import { AuthType } from "@jp/auth"
import { ChangePhoneForm } from "./change-phone-form"
import { ChangeEmailForm } from "./change-email-form"

export const ProfileForm = ({ user }: { user: AuthType["user"] }) => {
  const [file, setFile] = React.useState<File | null>(null)

  const form = useAppForm({
    defaultValues: {
      image: user?.image,
      name: user?.name,
    },
    validators: { onChange: profileSchema },
    onSubmit: async (values) => {
      console.log(values)
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
    form.setFieldValue("image", url)
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="rounded-2xl border"
      >
        <div className="flex border-b p-6">
          <Field>
            <FieldLabel className="text-base font-semibold">
              Profile Image
            </FieldLabel>
            <FieldDescription>
              This is your profile image.
              <br />
              Click on the logo to upload a custom one from your files.
            </FieldDescription>
          </Field>
          <Avatar className="relative size-24">
            <form.Subscribe
              selector={(state) => state.values.image}
              children={(image) => <AvatarImage src={image ?? ""} />}
            />
            <AvatarFallback>
              <User className="size-6" />
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
        <FieldGroup className="max-w-lg p-6">
          <form.AppField
            name="name"
            children={(field) => (
              <field.TextField label="Name" placeholder="john doe" />
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
      <div className="rounded-2xl border">
        <Field className="gap-0 p-6">
          <FieldLabel className="text-base font-semibold">
            Contact Information
          </FieldLabel>
          <FieldDescription>
            Update your password to keep your account secure.
          </FieldDescription>
        </Field>
        <FieldGroup className="p-6">
          <Field>
            <FieldLabel>Phone Number</FieldLabel>
            <div className="relative flex max-w-xl gap-2">
              <InputGroup>
                <InputGroupInput
                  disabled
                  defaultValue={user?.phoneNumber ?? ""}
                  placeholder="1234-123-123"
                />
                <InputGroupAddon
                  align="inline-end"
                  className="gap-1 text-primary"
                >
                  <VerifiedCheck className="size-4" />
                  Verified
                </InputGroupAddon>
              </InputGroup>
              <ChangePhoneForm>
                <Button variant="outline">Change</Button>
              </ChangePhoneForm>
            </div>
          </Field>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <div className="relative flex max-w-xl gap-2">
              <InputGroup>
                <InputGroupInput
                  disabled
                  defaultValue={user?.email ?? ""}
                  placeholder="yourname@email.com"
                />
                <InputGroupAddon
                  align="inline-end"
                  className="gap-1 bg-transparent text-primary"
                >
                  <VerifiedCheck className="size-4" />
                  Verified
                </InputGroupAddon>
              </InputGroup>

              <ChangeEmailForm>
                <Button variant="outline">Change</Button>
              </ChangeEmailForm>
            </div>
          </Field>
        </FieldGroup>
      </div>
    </div>
  )
}
