import React from "react"

import { FieldGroup } from "@jp/ui/components/field"

import { applicantAddress, US_STATES } from "@/features/careers/careers.const"
import { withForm } from "@/hooks/use-app-form"

export const ApplicantAddress = withForm({
  defaultValues: applicantAddress,
  render: function Render({ form }) {
    return (
      <FieldGroup className="grid grid-cols-1 @2xl:grid-cols-2">
        <div className="border-l-4 border-blue-500 bg-secondary p-4 text-base font-medium @2xl:col-span-2">
          Current Address
        </div>
        <form.AppField
          name="currentAddress.street"
          children={(field) => (
            <field.TextField
              label="Street Address"
              className="@2xl:col-span-2"
            />
          )}
        />
        <form.AppField
          name="currentAddress.city"
          children={(field) => <field.TextField label="City" />}
        />

        <form.AppField
          name="currentAddress.state"
          children={(field) => (
            <field.SelectField
              label="State"
              placeholder="Select"
              options={US_STATES}
            />
          )}
        />
        <form.AppField
          name="currentAddress.zip"
          children={(field) => <field.TextField label="Zip" />}
        />
        <form.AppField
          name="currentAddress.yearsAtAddress"
          children={(field) => <field.TextField label="Years at Address" />}
        />
        <div className="border-l-4 border-blue-500 bg-secondary p-4 text-base font-medium @2xl:col-span-2">
          Previous Address
        </div>
        <form.AppField
          name="mailingAddress.street"
          children={(field) => (
            <field.TextField
              label="Street Address"
              className="@2xl:col-span-2"
            />
          )}
        />
        <form.AppField
          name="mailingAddress.city"
          children={(field) => <field.TextField label="City" />}
        />

        <form.AppField
          name="mailingAddress.state"
          children={(field) => (
            <field.SelectField
              label="State"
              placeholder="Select"
              options={US_STATES}
            />
          )}
        />
        <form.AppField
          name="mailingAddress.zip"
          children={(field) => <field.TextField label="Zip" />}
        />
        <form.AppField
          name="mailingAddress.yearsAtAddress"
          children={(field) => <field.TextField label="Years at Address" />}
        />
      </FieldGroup>
    )
  },
})
