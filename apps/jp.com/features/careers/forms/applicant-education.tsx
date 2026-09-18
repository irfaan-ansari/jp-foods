import React from "react"
import { Button } from "@jp/ui/components/button"
import { Plus, Trash2 } from "lucide-react"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@jp/ui/components/field"

import { Textarea } from "@jp/ui/components/textarea"
import { applicantEducation } from "@/features/careers/careers.const"
import { withForm } from "@/hooks/use-app-form"

export const ApplicantEducation = withForm({
  defaultValues: applicantEducation,
  render: function Render({ form }) {
    return (
      <FieldGroup className="grid grid-cols-1 @2xl:grid-cols-2">
        <div className="border-l-4 border-blue-500 bg-secondary p-4 text-base font-medium @2xl:col-span-2">
          High School
        </div>
        <form.AppField
          name={`highSchool.institutionName`}
          children={(field) => <field.TextField label="Name" />}
        />
        <form.AppField
          name={`highSchool.fieldOfStudy`}
          children={(field) => <field.TextField label="School" />}
        />
        <form.AppField
          name={`highSchool.location`}
          children={(field) => <field.TextField label="Location" />}
        />
        <form.AppField
          name={`highSchool.yearCompleted`}
          children={(field) => <field.TextField label="Years Completed" />}
        />
        <form.Field
          name={`highSchool.details`}
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field className={`@2xl:col-span-2`}>
                <FieldLabel htmlFor={field.name}>Details</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  className="min-h-24 resize-none"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />
        <div className="border-l-4 border-blue-500 bg-secondary p-4 text-base font-medium @2xl:col-span-2">
          College
        </div>
        <form.AppField
          name={`collage.institutionName`}
          children={(field) => <field.TextField label="Institution Name" />}
        />
        <form.AppField
          name={`collage.fieldOfStudy`}
          children={(field) => <field.TextField label="Course of Study" />}
        />
        <form.AppField
          name={`collage.location`}
          children={(field) => <field.TextField label="Location" />}
        />
        <form.AppField
          name={`collage.yearCompleted`}
          children={(field) => <field.TextField label="Years Completed" />}
        />
        <form.Field
          name={`collage.details`}
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field className={`@2xl:col-span-2`}>
                <FieldLabel htmlFor={field.name}>Details</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  className="min-h-24 resize-none"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />
        <form.AppField
          name="otherEducations"
          mode="array"
          children={(field) => {
            return (
              <>
                {field.state.value.map((subField, i) => {
                  return (
                    <React.Fragment key={i}>
                      <div className="flex items-center justify-between border-l-4 border-blue-500 bg-secondary p-4 text-base font-medium @2xl:col-span-2">
                        Other Education
                        <Button
                          variant="outline"
                          size="icon"
                          type="button"
                          onClick={() => field.removeValue(i)}
                        >
                          <Trash2 />
                        </Button>
                      </div>

                      <form.AppField
                        name={`otherEducations[${i}].institutionName`}
                        children={(field) => <field.TextField label="Name" />}
                      />
                      <form.AppField
                        name={`otherEducations[${i}].fieldOfStudy`}
                        children={(field) => (
                          <field.TextField label="Course of Study" />
                        )}
                      />
                      <form.AppField
                        name={`otherEducations[${i}].location`}
                        children={(field) => (
                          <field.TextField label="Location" />
                        )}
                      />
                      <form.AppField
                        name={`otherEducations[${i}].yearCompleted`}
                        children={(field) => (
                          <field.TextField label="Years Completed" />
                        )}
                      />
                      <form.Field
                        name={`otherEducations[${i}].details`}
                        children={(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid
                          return (
                            <Field className={`@2xl:col-span-2`}>
                              <FieldLabel htmlFor={field.name}>
                                Details
                              </FieldLabel>
                              <Textarea
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                aria-invalid={isInvalid}
                                className="min-h-24 resize-none"
                              />
                              {isInvalid && (
                                <FieldError errors={field.state.meta.errors} />
                              )}
                            </Field>
                          )
                        }}
                      />
                    </React.Fragment>
                  )
                })}
                <Button
                  type="button"
                  variant="outline"
                  size="xl"
                  className="w-full border-dashed bg-primary/10 @2xl:col-span-2"
                  onClick={() =>
                    field.pushValue({
                      institutionName: "",
                      fieldOfStudy: "",
                      location: "",
                      yearCompleted: "",
                      details: "",
                    })
                  }
                >
                  <Plus />
                  Add Another
                </Button>
              </>
            )
          }}
        />
      </FieldGroup>
    )
  },
})
