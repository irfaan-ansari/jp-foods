import React from "react"
import { Plus, Trash2 } from "lucide-react"
import { withForm } from "@/hooks/use-app-form"

import { Button } from "@jp/ui/components/button"
import { FieldGroup } from "@jp/ui/components/field"
import { DriverFormValues } from "../careers.schema"

export const ApplicantAccidentHistory = withForm({
  defaultValues: {} as DriverFormValues,
  render: function Render({ form }) {
    return (
      <FieldGroup className="grid grid-cols-1 @2xl:grid-cols-2">
        <form.AppField
          name="accidentHistory"
          mode="array"
          children={(field) => {
            return (
              <>
                {field.state.value.map((subField, i) => {
                  return (
                    <React.Fragment key={i}>
                      <div className="flex items-center justify-between border-l-4 border-blue-500 bg-secondary p-4 text-base font-medium @2xl:col-span-2">
                        Accident
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
                        name={`accidentHistory[${i}].accidentDate`}
                        children={(field) => (
                          <field.DateField
                            label="Date of Accident"
                            placeholder="Select"
                          />
                        )}
                      />
                      <form.AppField
                        name={`accidentHistory[${i}].accidentNature`}
                        children={(field) => (
                          <field.TextField label="Nature of Accident" />
                        )}
                      />
                      <form.AppField
                        name={`accidentHistory[${i}].fatalitiesCount`}
                        children={(field) => (
                          <field.TextField label="Fatalities" />
                        )}
                      />
                      <form.AppField
                        name={`accidentHistory[${i}].injuriesCount`}
                        children={(field) => (
                          <field.TextField label="Injuries" />
                        )}
                      />

                      <form.AppField
                        name={`accidentHistory[${i}].chemicalSpill`}
                        children={(field) => (
                          <field.RadioField
                            label="Chemical Spills"
                            options={[
                              { label: "Yes", value: "yes" },
                              { label: "No", value: "no" },
                            ]}
                          />
                        )}
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
                      accidentDate: "",
                      accidentNature: "",
                      injuriesCount: "",
                      fatalitiesCount: "",
                      chemicalSpill: "",
                    })
                  }
                >
                  <Plus />
                  Add Accident
                </Button>
              </>
            )
          }}
        />
      </FieldGroup>
    )
  },
})
