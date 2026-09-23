"use client"

import { useAppForm } from "@/hooks/use-app-form"
import { productNew2Schema, productNew2Values } from "../product-new-2.schema"
import { Button } from "@jp/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@jp/ui/components/field"
import { Switch } from "@jp/ui/components/switch"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { PRODUCT_UNITS, STATUS } from "../product.const"

const packageUnits = PRODUCT_UNITS.filter(
  (item) => !["lb", "kg", "g", "oz"].includes(item.value)
)
const weightUnits = PRODUCT_UNITS.filter((item) =>
  ["lb", "kg", "g", "oz"].includes(item.value)
)

const splitDefaults = () => ({
  id: crypto.randomUUID(),
  uom: "pack",
  unitsPerCase: "",
  casePrice: "",
  minQuantity: "1",
})

export function ProductPricingPrototype() {
  const form = useAppForm({
    defaultValues: productNew2Values,
    validators: { onChange: productNew2Schema },
    onSubmit: () => toast.success("Preview ready. Nothing was saved."),
  })
  return (
    <form.Subscribe selector={(state) => state.values}>
      {(values) => {
        const average = values.weightMode === "average"
        const json = JSON.stringify(values, null, 2)
        return (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Card size="sm" className="shadow-xs">
                <CardHeader>
                  <CardTitle>Item Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <FieldGroup className="grid gap-4 lg:grid-cols-2">
                    <form.AppField
                      name="title"
                      children={(field) => (
                        <field.TextField
                          label="Item Name"
                          className="lg:col-span-2"
                          placeholder="Enter item name"
                        />
                      )}
                    />

                    <form.AppField
                      name="description"
                      children={(field) => (
                        <field.TextAreaField
                          label="Description"
                          className="lg:col-span-2"
                        />
                      )}
                    />
                    <form.AppField
                      name="itemCode"
                      children={(field) => (
                        <field.TextField label="Item Code" />
                      )}
                    />
                    <form.AppField
                      name="status"
                      children={(field) => (
                        <field.SelectField
                          label="Status"
                          options={Object.values(STATUS)
                            .filter((item) => item.value)
                            .map((item) => ({
                              value: item.value,
                              label: item.label,
                            }))}
                        />
                      )}
                    />
                    <form.AppField
                      name="uom"
                      children={(field) => (
                        <field.SelectField
                          label="Unit of Measure"
                          options={average ? weightUnits : PRODUCT_UNITS}
                        />
                      )}
                    />
                    <form.AppField
                      name="sellAs"
                      children={(field) => (
                        <field.SelectField
                          label="Order Unit"
                          options={packageUnits}
                        />
                      )}
                    />

                    <form.AppField
                      name="weightMode"
                      children={(field) => (
                        <field.SelectField
                          label="Weight Pricing"
                          options={[
                            { value: "fixed", label: "Fixed-Weight Case" },
                            { value: "average", label: "Catch-Weight Item" },
                          ]}
                        />
                      )}
                    />
                    <form.AppField
                      name="contents"
                      children={(field) => (
                        <field.TextField
                          label={`${average ? "Average " : ""}Case Size`}
                          inputMode="decimal"
                          suffix={values.uom}
                        />
                      )}
                    />
                    <form.AppField
                      name="price"
                      children={(field) => (
                        <field.TextField
                          label={
                            average
                              ? `Price per ${values.uom.toUpperCase()}`
                              : "Case Price"
                          }
                          inputMode="decimal"
                          prefix="$"
                          suffix={average ? `/${values.uom}` : "/case"}
                        />
                      )}
                    />
                    <form.AppField
                      name="minQuantity"
                      children={(field) => (
                        <field.TextField
                          label={`Minimum Order (${values.sellAs})`}
                          inputMode="number"
                        />
                      )}
                    />
                    <form.AppField
                      name="categories"
                      children={(field) => (
                        <field.TextField
                          label="Categories"
                          className="lg:col-span-2"
                        />
                      )}
                    />
                    <form.Field name="isTaxable">
                      {(field) => (
                        <Field
                          orientation="horizontal"
                          className="rounded-xl border px-3 py-2 lg:col-span-2"
                        >
                          <FieldLabel htmlFor={field.name}>
                            <FieldContent>
                              <FieldTitle>Taxable</FieldTitle>
                            </FieldContent>
                          </FieldLabel>
                          <Switch
                            id={field.name}
                            checked={field.state.value}
                            onCheckedChange={field.handleChange}
                          />
                        </Field>
                      )}
                    </form.Field>
                  </FieldGroup>
                </CardContent>
              </Card>
              <Card size="sm" className="shadow-xs">
                <CardHeader>
                  <form.Field name="trackInventory">
                    {(field) => (
                      <Field orientation="horizontal">
                        <FieldLabel htmlFor={field.name}>
                          <FieldContent>
                            <FieldTitle>Track Inventory</FieldTitle>
                            <FieldDescription>
                              Keep on-hand inventory up to date.
                            </FieldDescription>
                          </FieldContent>
                        </FieldLabel>
                        <Switch
                          id={field.name}
                          checked={field.state.value}
                          onCheckedChange={field.handleChange}
                        />
                      </Field>
                    )}
                  </form.Field>
                </CardHeader>
                <CardContent>
                  <form.AppField
                    name="location"
                    children={(field) => (
                      <field.TextField label="Warehouse Location" />
                    )}
                  />
                </CardContent>
              </Card>
              <Card size="sm" className="shadow-xs">
                <CardHeader>
                  <form.Field name="allowSplit">
                    {(field) => (
                      <Field orientation="horizontal">
                        <FieldLabel htmlFor={field.name}>
                          <FieldContent className="gap-0">
                            <FieldTitle>Allow Split-Case Orders</FieldTitle>
                            <FieldDescription>
                              Let customers order units from an opened case.
                            </FieldDescription>
                          </FieldContent>
                        </FieldLabel>
                        <Switch
                          id={field.name}
                          checked={field.state.value}
                          onCheckedChange={field.handleChange}
                        />
                      </Field>
                    )}
                  </form.Field>
                </CardHeader>
                <CardContent>
                  <form.Subscribe selector={(state) => state.values.allowSplit}>
                    {(enabled) =>
                      enabled && (
                        <form.Field name="splits" mode="array">
                          {(field) => (
                            <div className="space-y-4">
                              {field.state.value.map((split, index) => (
                                <div
                                  key={split.id}
                                  className="space-y-4 rounded-2xl border p-4"
                                >
                                  <div className="flex justify-between font-medium">
                                    Split-Case Option {index + 1}
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon-sm"
                                      disabled={field.state.value.length === 1}
                                      onClick={() => field.removeValue(index)}
                                    >
                                      <Trash2 className="size-4" />
                                    </Button>
                                  </div>
                                  <FieldGroup className="grid gap-4 lg:grid-cols-2">
                                    <form.AppField
                                      name={`splits[${index}].uom`}
                                      children={(item) => (
                                        <item.SelectField
                                          label="Split Selling Unit"
                                          options={packageUnits}
                                        />
                                      )}
                                    />
                                    <form.AppField
                                      name={`splits[${index}].unitsPerCase`}
                                      children={(item) => (
                                        <item.TextField
                                          label="Case Pack"
                                          inputMode="number"
                                        />
                                      )}
                                    />
                                    <form.AppField
                                      name={`splits[${index}].casePrice`}
                                      children={(item) => (
                                        <item.TextField
                                          label="Split-Case Price"
                                          inputMode="decimal"
                                          prefix="$"
                                          suffix="/case"
                                        />
                                      )}
                                    />
                                    <form.AppField
                                      name={`splits[${index}].minQuantity`}
                                      children={(item) => (
                                        <item.TextField
                                          label={`Minimum Split Order (${split.uom})`}
                                          inputMode="number"
                                        />
                                      )}
                                    />
                                  </FieldGroup>
                                </div>
                              ))}
                              <Button
                                type="button"
                                variant="outline"
                                className="w-full border-dashed"
                                onClick={() => field.pushValue(splitDefaults())}
                              >
                                <Plus />
                                Add Split Option
                              </Button>
                            </div>
                          )}
                        </form.Field>
                      )
                    }
                  </form.Subscribe>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6 lg:sticky lg:top-20">
              <Card size="sm">
                <CardHeader>
                  <CardTitle>JSON Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="max-h-[70vh] overflow-auto rounded-xl border bg-muted/40 p-3 text-xs">
                    <code>{json}</code>
                  </pre>
                </CardContent>
              </Card>
              <Button className="w-full" onClick={() => form.handleSubmit()}>
                Review Item
              </Button>
            </div>
          </div>
        )
      }}
    </form.Subscribe>
  )
}
