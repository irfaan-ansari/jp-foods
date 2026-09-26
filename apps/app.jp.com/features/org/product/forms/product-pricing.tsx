import { withForm } from "@/hooks/use-app-form"
import { MEASURE_UNITS } from "@jp/utils/commerce"
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
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@jp/ui/components/field"
import { Switch } from "@jp/ui/components/switch"
import { Badge } from "@jp/ui/components/badge"
import { formatUSD } from "@jp/utils"
import { Button } from "@jp/ui/components/button"
import { Plus } from "lucide-react"
import { TrashBinMinimalistic } from "@solar-icons/react"
import { getUnit } from "@jp/utils/commerce"

export const ProductPricing = withForm({
  defaultValues: {} as ProductFormSchema,
  render: function Render({ form }) {
    const handleClick = () => {
      form.pushFieldValue("sellingUnits", {
        name: "lb",
        displayLabel: "",
        price: "",
        qtyPerUnit: "1",
        isDefault: false,
      })
    }

    return (
      <Card size="sm" className="bg-linear-to-br from-primary/10 shadow-xs">
        <CardHeader>
          <CardTitle className="font-bold">Units and pricing</CardTitle>
        </CardHeader>
        <form.Subscribe selector={(state) => state.values}>
          {({ uom, catchWeight }) => {
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

                {/* split items */}
                <form.Field name="sellingUnits" mode="array">
                  {(field) => {
                    return (
                      <div className="space-y-4">
                        <FieldError errors={field.state.meta.errors} />
                        {field.state.value.map((subField, i) => {
                          return (
                            <Card
                              key={i}
                              size="sm"
                              className={
                                subField.isDefault
                                  ? "ring-2 ring-primary/50"
                                  : ""
                              }
                            >
                              <CardContent className="relative">
                                <div className="absolute -top-1 right-4 flex items-center gap-1.5">
                                  {subField.isDefault ? (
                                    <Badge variant="primary-light">
                                      Default
                                    </Badge>
                                  ) : (
                                    <Button
                                      type="button"
                                      size="xs"
                                      variant="outline"
                                      onClick={() => {
                                        field.setValue((previous) =>
                                          previous.map((unit, index) => ({
                                            ...unit,
                                            isDefault: index === i,
                                          }))
                                        )
                                      }}
                                    >
                                      Make Default
                                    </Button>
                                  )}
                                  {!subField.isDefault &&
                                    field.state.value.length > 1 && (
                                      <Button
                                        type="button"
                                        aria-label="Remove split option"
                                        size="icon-xs"
                                        variant="destructive"
                                        onClick={() => field.removeValue(i)}
                                      >
                                        <TrashBinMinimalistic />
                                      </Button>
                                    )}
                                </div>

                                <FieldGroup className="grid lg:grid-cols-3">
                                  <form.AppField
                                    name={`sellingUnits[${i}].name`}
                                    children={(field) => (
                                      <field.SelectField
                                        className="lg:col-span-3"
                                        label="Sell as"
                                        options={MEASURE_UNITS}
                                      />
                                    )}
                                  />

                                  <form.AppField
                                    name={`sellingUnits[${i}].price`}
                                    children={(field) => (
                                      <field.TextField
                                        label="Price"
                                        placeholder="2.00"
                                        className="**:data-[slot=input-group-addon]:uppercase"
                                        inputMode="decimal"
                                        prefix={"$"}
                                        suffix={
                                          catchWeight ? uom : subField.name
                                        }
                                      />
                                    )}
                                  />

                                  <form.AppField
                                    name={`sellingUnits[${i}].qtyPerUnit`}
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
                                    name={`sellingUnits[${i}].displayLabel`}
                                    children={(field) => (
                                      <field.TextField
                                        label="Label (optional)"
                                        placeholder="Case"
                                      />
                                    )}
                                  />
                                </FieldGroup>

                                {/* preview */}
                                <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-2.5">
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 space-x-1">
                                      <span className="font-semibold">
                                        {subField.displayLabel ||
                                          getUnit(subField.name)?.label}
                                      </span>
                                      <span className="text-muted-foreground">
                                        • {subField.qtyPerUnit} {uom}{" "}
                                        {catchWeight && "avg"}
                                      </span>
                                    </div>
                                    <span className="text-base font-bold text-primary">
                                      {formatUSD(subField.price)}
                                      {catchWeight && (
                                        <span className="text-xs font-normal text-muted-foreground">
                                          {" / "}
                                          {uom}
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full border-dashed"
                          onClick={handleClick}
                        >
                          <Plus /> Add option
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
