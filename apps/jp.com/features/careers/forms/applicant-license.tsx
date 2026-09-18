import React from "react"

import { FieldGroup } from "@jp/ui/components/field"

import {
  CDL_CLASSES,
  CDL_ENDORSEMENTS,
  US_STATES,
} from "@/features/careers/careers.const"
import { withForm } from "@/hooks/use-app-form"
import { DriverFormValues } from "../careers.schema"

export const ApplicantLicense = withForm({
  defaultValues: {} as DriverFormValues,
  render: function Render({ form }) {
    return (
      <FieldGroup className="grid grid-cols-1 @2xl:grid-cols-2">
        <form.AppField
          name="currentLicense.licenseNumber"
          children={(field) => (
            <field.TextField
              label="License Number"
              className="@2xl:col-span-2"
            />
          )}
        />
        <form.AppField
          name="currentLicense.licenseType"
          children={(field) => (
            <field.SelectField
              label="Type/Class"
              placeholder="Select"
              options={CDL_CLASSES}
            />
          )}
        />
        <form.AppField
          name="currentLicense.endorsements"
          children={(field) => (
            <field.SelectField
              label="Endorsements"
              placeholder="Select"
              options={CDL_ENDORSEMENTS}
            />
          )}
        />
        <form.AppField
          name="currentLicense.state"
          children={(field) => (
            <field.SelectField
              label="Issuing State"
              placeholder="Select"
              options={US_STATES}
            />
          )}
        />
        <form.AppField
          name="currentLicense.expiryDate"
          children={(field) => (
            <field.DateField label="Expiration Date" placeholder="Select" />
          )}
        />
      </FieldGroup>
    )
  },
})
