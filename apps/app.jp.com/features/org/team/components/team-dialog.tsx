"use client"
import { useAppForm } from "@/hooks/use-app-form"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@jp/ui/components/field"
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
import { Card, CardContent } from "@jp/ui/components/card"
import { Switch } from "@jp/ui/components/switch"

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

  return (
    <AppDialog open={open} onOpenChange={setOpen}>
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>
      <AppDialogContent className="md:max-w-2xl">
        <AppDialogHeader className="data-[slot=drawer-header]:sr-only">
          <AppDialogTitle className="text-lg font-bold">
            {id ? "Edit Customer" : "New Customer"}
          </AppDialogTitle>
        </AppDialogHeader>
        <form
          onSubmit={form.handleSubmit}
          className="flex h-[max(520px,70svh)] flex-col gap-4 overflow-hidden md:gap-6"
        >
          <div className="no-scrollbar flex-1 space-y-6 overflow-auto p-px">
            {/* Company */}
            <section className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold">Company</h3>
                <p className="text-xs text-muted-foreground">
                  Basic customer and company information.
                </p>
              </div>

              <FieldGroup className="grid md:grid-cols-2">
                <form.AppField
                  name="name"
                  children={(field) => (
                    <field.TextField
                      className="md:col-span-2"
                      label="Company Name"
                      placeholder="Company name"
                    />
                  )}
                />

                <form.AppField
                  name="managerName"
                  children={(field) => (
                    <field.TextField
                      label="Manager Name"
                      placeholder="Manager name"
                    />
                  )}
                />

                <form.AppField
                  name="salesRep"
                  children={(field) => (
                    <field.TextField
                      label="Sales Representative"
                      placeholder="Select sales representative"
                    />
                  )}
                />
              </FieldGroup>
            </section>

            {/* Contact */}
            <section className="space-y-4 border-t pt-6">
              <div>
                <h3 className="text-sm font-semibold">Contact</h3>
                <p className="text-xs text-muted-foreground">
                  Primary contact details for this customer.
                </p>
              </div>

              <FieldGroup className="grid md:grid-cols-2">
                <form.AppField
                  name="phoneNumber"
                  children={(field) => (
                    <field.TextField
                      label="Phone Number"
                      prefix={<Smartphone className="size-4" />}
                      placeholder="+1 234 567 8900"
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
              </FieldGroup>
            </section>

            {/* Address */}
            <section className="space-y-4 border-t pt-6">
              <div>
                <h3 className="text-sm font-semibold">Address</h3>
                <p className="text-xs text-muted-foreground">
                  Billing or primary business location.
                </p>
              </div>

              <FieldGroup className="grid md:grid-cols-2">
                <form.AppField
                  name="address"
                  children={(field) => (
                    <field.TextField
                      className="md:col-span-2"
                      label="Street Address"
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
                    <field.TextField label="ZIP Code" placeholder="78701" />
                  )}
                />

                <form.AppField
                  name="country"
                  children={(field) => (
                    <field.TextField
                      label="Country"
                      placeholder="United States"
                    />
                  )}
                />
              </FieldGroup>
            </section>

            {/* Account & Pricing */}
            <section className="space-y-4 border-t pt-6">
              <div>
                <h3 className="text-sm font-semibold">Account & Pricing</h3>
                <p className="text-xs text-muted-foreground">
                  Pricing, tax, and credit settings.
                </p>
              </div>

              <FieldGroup className="grid md:grid-cols-2">
                <form.AppField
                  name="priceLevel"
                  children={(field) => (
                    <field.TextField
                      label="Price Level"
                      placeholder="Standard"
                    />
                  )}
                />

                <form.AppField
                  name="taxRule"
                  children={(field) => (
                    <field.TextField label="Tax Rule" placeholder="Standard" />
                  )}
                />

                <Field
                  orientation="vertical"
                  className="rounded-xl border p-4 md:col-span-2"
                >
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="enable-credit" className="flex-1">
                      <FieldContent>
                        <FieldTitle>Enable Credit</FieldTitle>
                        <FieldDescription>
                          Allow this customer to purchase using an assigned
                          credit limit.
                        </FieldDescription>
                      </FieldContent>
                    </FieldLabel>

                    <Switch id="enable-credit" />
                  </div>

                  <form.AppField
                    name="creditLimit"
                    children={(field) => (
                      <field.TextField
                        prefix="$"
                        inputMode="decimal"
                        label="Credit Limit"
                        placeholder="1,000"
                      />
                    )}
                  />
                </Field>
              </FieldGroup>
            </section>
          </div>
        </form>
      </AppDialogContent>
    </AppDialog>
  )
}
