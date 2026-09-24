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
import { Plus } from "lucide-react"
import { TrashBinMinimalistic } from "@solar-icons/react"

export const ProductPricing = withForm({
  defaultValues: {} as ProductFormSchema,
  render: function Render({ form }) {
    const handleClick = () => {
      form.pushFieldValue("sellUnits", {
        name: "lb",
        label: "",
        price: form.getFieldValue("price"),
        unitConversion: "1",
      })
    }

    return (
      <Card size="sm" className="bg-linear-to-br from-primary/10 shadow-xs">
        <CardHeader>
          <CardTitle className="font-bold">Units and pricing</CardTitle>
        </CardHeader>
        <form.Subscribe selector={(state) => state.values}>
          {({ uom, sellUnit, label, catchWeight, contains }) => {
            return (
              <CardContent className="space-y-6">
                <FieldGroup className="grid items-end lg:grid-cols-3">
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
                    name="weightLb"
                    children={(field) => (
                      <field.TextField
                        label="Weight"
                        inputMode="decimal"
                        suffix="LB"
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

                {/* default selling option */}
                <Card size="sm" className="ring-2 ring-primary/50">
                  <CardContent className="relative">
                    <Badge
                      variant="default"
                      className="absolute -top-1 right-4"
                    >
                      {label || sellUnit}
                    </Badge>
                    <FieldGroup className="grid lg:grid-cols-3">
                      <form.AppField
                        name="sellUnit"
                        children={(field) => (
                          <field.SelectField
                            className="lg:col-span-3"
                            label="Selling Unit"
                            options={MEASURE_UNITS}
                          />
                        )}
                      />

                      <form.AppField
                        name="price"
                        children={(field) => (
                          <field.TextField
                            label="Price"
                            placeholder="2.00"
                            className="**:data-[slot=input-group-addon]:uppercase"
                            inputMode="decimal"
                            prefix={"$"}
                            suffix={catchWeight ? uom : sellUnit}
                          />
                        )}
                      />
                      <form.AppField
                        name="contains"
                        children={(field) => (
                          <field.TextField
                            label="Contains"
                            placeholder="60"
                            className="**:data-[slot=input-group-addon]:uppercase"
                            inputMode="decimal"
                            suffix={uom}
                          />
                        )}
                      />
                      <form.AppField
                        name="label"
                        children={(field) => (
                          <field.TextField
                            label="Label (optional)"
                            placeholder="10LB CASE"
                          />
                        )}
                      />
                    </FieldGroup>
                  </CardContent>
                </Card>

                {/* split items */}
                <form.Field name="sellUnits" mode="array">
                  {(field) => {
                    return (
                      <div className="space-y-4">
                        {field.state.value.map((subField, i) => {
                          const conv = Number(subField.unitConversion)
                          const price = Number(subField.price)
                          const qty = Number(contains)
                          const valid = conv > 0

                          const whole = [contains, uom, sellUnit]
                            .filter(Boolean)
                            .join(" ")
                          const perSplit = valid && qty ? qty / conv : null
                          return (
                            <Card size="sm">
                              <CardContent className="relative">
                                <Button
                                  size="icon-xs"
                                  variant="destructive"
                                  className="absolute -top-1 right-4"
                                  onClick={() => field.removeValue(i)}
                                >
                                  <TrashBinMinimalistic />
                                </Button>
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

                                  <form.AppField
                                    name={`sellUnits[${i}].price`}
                                    children={(field) => (
                                      <field.TextField
                                        label="Price"
                                        placeholder="2.00"
                                        className="**:data-[slot=input-group-addon]:uppercase"
                                        inputMode="decimal"
                                        prefix={"$"}
                                        suffix={catchWeight ? uom : sellUnit}
                                      />
                                    )}
                                  />

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

                                  <form.AppField
                                    name={`sellUnits[${i}].label`}
                                    children={(field) => (
                                      <field.TextField
                                        label="Label (optional)"
                                        placeholder="5LB Bag"
                                      />
                                    )}
                                  />
                                </FieldGroup>

                                {/* preview */}
                                <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-2.5">
                                  <div className="flex items-center gap-2">
                                    <div className="grid min-w-0">
                                      <span className="truncate text-base font-bold">
                                        {subField.label ||
                                          subField.name ||
                                          "Untitled"}
                                      </span>
                                      {valid && (
                                        <p className="text-muted-foreground">
                                          <strong>Conversion:</strong> {whole} ÷{" "}
                                          {conv} split units
                                          {perSplit !== null &&
                                            ` = ${perSplit} ${uom ?? ""}`}
                                        </p>
                                      )}
                                    </div>
                                    <span className="ml-auto shrink-0 text-base font-bold text-primary">
                                      {valid && price
                                        ? formatUSD(price / conv)
                                        : "—"}
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                        <Button
                          variant="outline"
                          className="w-full border-dashed"
                          onClick={handleClick}
                        >
                          <Plus /> Add split option
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
