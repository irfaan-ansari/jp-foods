import { withForm } from "@/hooks/use-app-form"
import { PRODUCT_UNITS } from "../product.const"
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
  FieldTitle,
} from "@jp/ui/components/field"
import { Switch } from "@jp/ui/components/switch"

export const ProductPricing = withForm({
  defaultValues: {} as ProductFormSchema,
  render: function Render({ form }) {
    return (
      <Card size="sm" className="shadow-xs">
        <CardHeader>
          <CardTitle className="font-bold">Pack & Price Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup className="grid grid-cols-1 lg:grid-cols-2">
            <form.AppField
              name="uom"
              children={(field) => (
                <field.SelectField label="UOM" options={PRODUCT_UNITS} />
              )}
            />
            <form.AppField
              name="sellUnit"
              children={(field) => (
                <field.SelectField label="Sell Unit" options={PRODUCT_UNITS} />
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
                    className="rounded-xl border px-3 py-2.5 lg:col-span-2"
                    data-invalid={isInvalid}
                  >
                    <FieldLabel htmlFor={field.name}>
                      <FieldContent>
                        <FieldTitle>Average Weight</FieldTitle>
                      </FieldContent>
                    </FieldLabel>
                    <Switch
                      className="self-center"
                      id={field.name}
                      name={field.name}
                      checked={field.state.value}
                      onCheckedChange={field.handleChange}
                      aria-invalid={isInvalid}
                    />
                  </Field>
                )
              }}
            />
            <form.Subscribe
              selector={(state) => state.values.uom}
              children={(uom) => (
                <form.AppField
                  name="unitSize"
                  children={(field) => (
                    <field.TextField
                      label="Weight"
                      placeholder="60"
                      inputMode="decimal"
                      suffix={uom}
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
                      label="Pack Size"
                      placeholder="1"
                      inputMode="number"
                      suffix={`of ${unitSize || "—"} ${uom}`}
                    />
                  )}
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
                      className="lg:col-span-2"
                      label={
                        state.catchWeight
                          ? `Price per ${state.uom}`
                          : `Price per ${state.sellUnit}`
                      }
                      placeholder="2.00"
                      inputMode="decimal"
                      prefix={"$"}
                      suffix={state.catchWeight ? state.uom : state.sellUnit}
                    />
                  )}
                />
              )}
            />
          </FieldGroup>
        </CardContent>
      </Card>
    )
  },
})
