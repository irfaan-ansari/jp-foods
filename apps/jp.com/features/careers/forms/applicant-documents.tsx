import { FieldGroup } from "@jp/ui/components/field"

import { withForm } from "@jp/ui/forms/public"
import { DriverFormValues } from "../careers.schema"
import { Alert, AlertDescription, AlertTitle } from "@jp/ui/components/alert"
import { Info } from "lucide-react"

export const ApplicantDocuments = withForm({
  defaultValues: {} as DriverFormValues,
  render: function Render({ form }) {
    return (
      <FieldGroup className="grid grid-cols-1">
        <Alert variant="warning">
          <Info />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            All uploaded files must be in PDF, JPG, or PNG format and must not
            exceed 5 MB per file.
          </AlertDescription>
        </Alert>
        <form.AppField
          name="drivingLicenseFront"
          children={(field) => (
            <field.FileField label="ID Card/Driver’s License (Front)" />
          )}
        />
        <form.AppField
          name="drivingLicenseBack"
          children={(field) => (
            <field.FileField label="ID Card/Driver’s License (Back)" />
          )}
        />
        <form.AppField
          name="socialSecurityFront"
          children={(field) => (
            <field.FileField label="  Social Security Card (Front)" />
          )}
        />
        <form.AppField
          name="socialSecurityBack"
          children={(field) => (
            <field.FileField label="  Social Security Card (Back)" />
          )}
        />
        <form.AppField
          name="dotFront"
          children={(field) => (
            <field.FileField label="DOT Medical Certificate (Front)" />
          )}
        />
        <form.AppField
          name="dotBack"
          children={(field) => (
            <field.FileField label="DOT Medical Certificate (Back)" />
          )}
        />
      </FieldGroup>
    )
  },
})
