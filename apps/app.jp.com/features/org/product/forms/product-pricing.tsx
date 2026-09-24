import { withForm } from "@/hooks/use-app-form"
import { MEASURE_UNITS, WEIGHT_UNITS } from "../product.const"
import { ProductFormSchema } from "../product.schema"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldTitle,
} from "@jp/ui/components/field"
import { Switch } from "@jp/ui/components/switch"
import { Badge } from "@jp/ui/components/badge"
import { formatUSD } from "@jp/utils"
import { Button } from "@jp/ui/components/button"

export const ProductPricing = withForm({
  defaultValues: {} as ProductFormSchema,
  render: function Render({ form }) {
    return (
      <Card size="sm" className="bg-linear-to-br from-primary/10 shadow-xs">
        <CardHeader>
          <CardTitle className="font-bold">Units and pricing</CardTitle>
        </CardHeader>
        <form.Subscribe selector={(state) => state.values}>
          {(values) => {
            return (
              <CardContent className="space-y-6">
                <FieldGroup className="grid grid-cols-3">
                  <form.AppField
                    name="uom"
                    children={(field) => (
                      <field.SelectField
                        label="Unit of Measure"
                        options={MEASURE_UNITS}
                      />
                    )}
                  />
                  <form.AppField
                    name="weightUnit"
                    children={(field) => (
                      <field.SelectField
                        label="Weight unit"
                        options={WEIGHT_UNITS}
                      />
                    )}
                  />
                  <form.AppField
                    name="netWeight"
                    children={(field) => (
                      <field.TextField
                        label="Weight"
                        inputMode="decimal"
                        suffix={values.weightUnit}
                      />
                    )}
                  />
                  <form.Field
                    name="catchWeight"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid
                      return (
                        <Field
                          orientation="horizontal"
                          data-invalid={isInvalid}
                        >
                          <FieldLabel
                            htmlFor={field.name}
                            className="h-10 rounded-xl border bg-input/50 p-3 has-data-checked:bg-input/50"
                          >
                            <FieldContent>
                              <FieldTitle>Catch weight</FieldTitle>
                            </FieldContent>
                            <Switch
                              className="self-center"
                              id={field.name}
                              name={field.name}
                              checked={field.state.value}
                              onCheckedChange={field.handleChange}
                              aria-invalid={isInvalid}
                            />
                          </FieldLabel>
                        </Field>
                      )
                    }}
                  />
                </FieldGroup>

                <div className="flex gap-2 rounded-2xl border border-dashed bg-background p-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Badge key={i} variant="default" className="rounded-md">
                      1 LB
                    </Badge>
                  ))}
                  <div>1 Case = 5 Jug . 20 lb in total</div>
                </div>
                <Card size="sm" className="ring-2 ring-primary/50">
                  <CardContent className="relative">
                    <Badge
                      variant="default"
                      className="absolute -top-1 right-4"
                    >
                      {values.sellUnit}
                    </Badge>
                    <FieldGroup className="grid lg:grid-cols-3">
                      <form.AppField
                        name="sellUnit"
                        children={(field) => (
                          <field.SelectField
                            className="lg:col-span-3"
                            label="Sell Unit"
                            options={MEASURE_UNITS}
                          />
                        )}
                      />

                      <form.Subscribe
                        selector={(state) => state.values}
                        children={(state) => (
                          <form.AppField
                            name="price"
                            children={(field) => (
                              <field.TextField
                                label="Price"
                                placeholder="2.00"
                                className="**:data-[slot=input-group-addon]:uppercase"
                                inputMode="decimal"
                                prefix={"$"}
                                suffix={
                                  state.catchWeight ? state.uom : state.sellUnit
                                }
                              />
                            )}
                          />
                        )}
                      />
                      <form.Subscribe
                        selector={(state) => state.values}
                        children={(state) => (
                          <form.AppField
                            name="unitSize"
                            children={(field) => (
                              <field.TextField
                                label="Contains"
                                placeholder="60"
                                className="**:data-[slot=input-group-addon]:uppercase"
                                inputMode="decimal"
                                suffix={state.uom}
                              />
                            )}
                          />
                        )}
                      />
                      <form.Subscribe
                        selector={(state) => state.values}
                        children={({ uom, unitSize }) => (
                          <form.AppField
                            name="packSize"
                            children={(field) => (
                              <field.TextField
                                label="Label (optional)"
                                placeholder="4 jugs of 5LB"
                              />
                            )}
                          />
                        )}
                      />
                    </FieldGroup>
                  </CardContent>
                </Card>

                {/* split items */}
                <form.Field name="sellUnits" mode="array">
                  {(field) => {
                    console.log(field.state.value)
                    return (
                      <div className="space-y-4">
                        {field.state.value.map((subField, i) => (
                          <Card size="sm">
                            <CardContent className="relative">
                              <Badge
                                variant="default"
                                className="absolute -top-1 right-4"
                              >
                                {subField.name}
                              </Badge>
                              <FieldGroup className="grid lg:grid-cols-3">
                                <form.AppField
                                  name={`sellUnits[${i}].name`}
                                  children={(field) => (
                                    <field.SelectField
                                      className="lg:col-span-3"
                                      label="Split Unit"
                                      options={MEASURE_UNITS}
                                    />
                                  )}
                                />

                                <form.Subscribe
                                  selector={(state) => state.values}
                                  children={(state) => (
                                    <form.AppField
                                      name={`sellUnits[${i}].price`}
                                      children={(field) => (
                                        <field.TextField
                                          label="Price"
                                          placeholder="2.00"
                                          className="**:data-[slot=input-group-addon]:uppercase"
                                          inputMode="decimal"
                                          prefix={"$"}
                                          suffix={values.sellUnit}
                                        />
                                      )}
                                    />
                                  )}
                                />
                                <form.Subscribe
                                  selector={(state) => state.values}
                                  children={(state) => (
                                    <form.AppField
                                      name={`sellUnits[${i}].unitConversion`}
                                      children={(field) => (
                                        <field.TextField
                                          label="Split into"
                                          placeholder="60"
                                          className="**:data-[slot=input-group-addon]:uppercase"
                                          inputMode="decimal"
                                          suffix={subField.name}
                                        />
                                      )}
                                    />
                                  )}
                                />
                                <form.Subscribe
                                  selector={(state) => state.values}
                                  children={({ uom, unitSize }) => (
                                    <form.AppField
                                      name="packSize"
                                      children={(field) => (
                                        <field.TextField
                                          label="Label (optional)"
                                          placeholder="4 jugs of 5LB"
                                        />
                                      )}
                                    />
                                  )}
                                />
                                <div className="lg:col-span-3">
                                  <div>
                                    {" "}
                                    price:
                                    {formatUSD(
                                      subField.price / subField.unitConversion
                                    )}
                                  </div>
                                  <div>
                                    {" "}
                                    size/weight:
                                    {values.unitSize /
                                      subField.unitConversion}{" "}
                                    {values.uom}
                                  </div>
                                </div>
                              </FieldGroup>
                            </CardContent>
                          </Card>
                        ))}
                        <Button
                          variant="outline"
                          className="w-full border-dashed"
                        >
                          Add split option
                        </Button>
                      </div>
                    )
                  }}
                </form.Field>
              </CardContent>
            )
          }}
        </form.Subscribe>
      </Card>
    )
  },
})
