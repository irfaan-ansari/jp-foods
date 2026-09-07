"use client"
import { useAppForm } from "@/hooks/use-app-form"
import { FieldGroup } from "@jp/ui/components/field"
import {
  AppDialog,
  AppDialogContent,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogTrigger,
} from "@jp/ui/components/jp/app-dialog"
import { Letter, Smartphone } from "@solar-icons/react"
import React from "react"
import { TEAM_STATUS } from "../team.const"

export const TeamDialog = ({
  id,
  children,
}: {
  id?: string
  children: React.ReactNode
}) => {
  const [open, setOpen] = React.useState(false)

  const form = useAppForm({
    defaultValues: {
      name: "",
      managerName: "",
      phoneNumber: "",
      email: "",
      country: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      status: "",
    },
  })

  
  >
    

  return (
    <AppDialog open={open} setOpen={setOpen}>
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>
      <AppDialogContent className="md:max-w-2xl">
        <AppDialogHeader className="data-[slot=drawer-header]:sr-only">
          <AppDialogTitle className="text-lg font-bold">
            {id ? "Edit Customer" : "New Customer"}
          </AppDialogTitle>
        </AppDialogHeader>
        <form onSubmit={form.handleSubmit} className="flex h-[max(520px,70svh)] flex-col gap-4 overflow-hidden md:gap-6">
        <div className="no-scrollbar flex-1 overflow-auto p-px">
          <FieldGroup className="grid md:grid-cols-2">
            <form.AppField
              name="name"
              children={(field) => (
                <field.TextField
                  className="md:col-span-2"
                  label="Name"
                  placeholder="Business name"
                />
              )}
            />
            <form.AppField
              name="managerName"
              children={(field) => (
                <field.TextField
                  className="md:col-span-2"
                  label="Manager Name"
                  placeholder="Manager name"
                />
              )}
            />
            <form.AppField
              name="phoneNumber"
              children={(field) => (
                <field.TextField
                  label="Phone Number"
                  prefix={<Smartphone className="size-4" />}
                  placeholder="+1234 xxx"
                />
              )}
            />
            <form.AppField
              name="email"
              children={(field) => (
                <field.TextField
                  label="Email"
                  prefix={<Letter className="size-4" />}
                  placeholder="name@company.com"
                />
              )}
            />

            <form.AppField
              name="address"
              children={(field) => (
                <field.TextField
                  className="md:col-span-2"
                  label="Address"
                  placeholder="123 Example Street"
                />
              )}
            />
            <form.AppField
              name="city"
              children={(field) => (
                <field.TextField label="City" placeholder="Austin" />
              )}
            />
            <form.AppField
              name="state"
              children={(field) => (
                <field.TextField label="State" placeholder="Texas" />
              )}
            />
            <form.AppField
              name="pincode"
              children={(field) => (
                <field.TextField label="Pincode" placeholder="78701" />
              )}
            />
            <form.AppField
              name="country"
              children={(field) => (
                <field.TextField label="Country" placeholder="United States" />
              )}
            />
            <form.AppField
              name="status"
              children={(field) => (
                <field.SelectField
                  label="Status"
                  className="md:col-span-2"
                  placeholder="Select..."
                  options={TEAM_STATUS}
                />
              )}
            />
          </FieldGroup>
          </div>
        </form>
      </AppDialogContent>
    </AppDialog>
  )
}
