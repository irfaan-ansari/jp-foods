import React from "react"
import { Button } from "@jp/ui/components/button"
import { Textarea } from "@jp/ui/components/textarea"
import { Plus, Trash2 } from "lucide-react"
import { withForm } from "@/hooks/use-app-form"
import translations from "@/features/apply/customer.translations.json"
import { DELIVERY_DAYS, DELIVERY_TIME } from "@/features/apply/customer.const"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@jp/ui/components/field"
import {
  type Translations,
  useTranslation,
} from "@/components/language-selector"
import { CardDescription, CardTitle } from "@jp/ui/components/card"
import { CustomerFormType } from "../customer.schema"

export const BusinessDelivery = withForm({
  defaultValues: {} as CustomerFormType,
  render: function Render({ form }) {
    const { t } = useTranslation(translations as Translations, "en")

    return (
      <FieldGroup className="grid grid-cols-1 lg:grid-cols-2">
        <form.AppField
          name="lockboxPermission"
          children={(field) => (
            <field.RadioField
              label={t[field.name]}
              className="lg:col-span-2"
              options={[
                { label: "Yes", value: "yes" },
                { label: "No", value: "no" },
                { label: "In future", value: "future" },
              ]}
            />
          )}
        />
        <form.AppField
          name="deliverySchedule"
          mode="array"
          children={(field) => {
            return (
              <>
                {field.state.value.map((_, i) => {
                  return (
                    <React.Fragment key={i}>
                      <div className="flex gap-4 lg:col-span-2">
                        <div className="div flex-1">
                          <CardTitle className="text-lg">
                            Delivery preference
                          </CardTitle>
                          <CardDescription>
                            Choose a preferred delivery day and time.
                          </CardDescription>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          type="button"
                          onClick={() => field.removeValue(i)}
                          className={i <= 0 ? "hidden" : ""}
                        >
                          <Trash2 />
                        </Button>
                      </div>

                      <form.AppField
                        name={`deliverySchedule[${i}].day`}
                        children={(field) => (
                          <field.SelectField
                            label={t["deliveryDay"]}
                            options={DELIVERY_DAYS}
                            placeholder="Select"
                          />
                        )}
                      />
                      <form.AppField
                        name={`deliverySchedule[${i}].window`}
                        children={(field) => (
                          <field.SelectField
                            options={DELIVERY_TIME}
                            label={t["deliveryWindow"]}
                            placeholder="Select"
                          />
                        )}
                      />
                      <form.AppField
                        name={`deliverySchedule[${i}].receivingName`}
                        children={(field) => (
                          <field.TextField
                            label={t["receivingName"]}
                            placeholder={"Enter receiving contact name"}
                          />
                        )}
                      />
                      <form.AppField
                        name={`deliverySchedule[${i}].receivingPhone`}
                        children={(field) => (
                          <field.TextField
                            label={t["receivingPhone"]}
                            placeholder={"(555) 222-3344"}
                          />
                        )}
                      />
                      <form.AppField
                        name={`deliverySchedule[${i}].instructions`}
                        children={(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid
                          return (
                            <field.TextAreaField
                              label={t["deliveryInstructions"]}
                            />
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
                  className="w-full border-dashed bg-primary/10 lg:col-span-2"
                  onClick={() =>
                    field.pushValue({
                      day: "",
                      window: "",
                      receivingName: "",
                      receivingPhone: "",
                      instructions: "",
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
