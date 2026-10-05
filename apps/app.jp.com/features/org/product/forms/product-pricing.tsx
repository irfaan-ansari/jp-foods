import { withForm } from "@/hooks/use-app-form"
import {
  getUnit,
  MEASURE_UNITS,
  withCalculatedPrices,
} from "@jp/utils/commerce"
import { ProductFormSchema } from "../product.schema"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"
import { FieldError, FieldGroup } from "@jp/ui/components/field"
import { Button } from "@jp/ui/components/button"
import { formatUSD } from "@jp/utils"
import { Plus } from "lucide-react"

export const ProductPricing = withForm({
  defaultValues: {} as ProductFormSchema,
  render: function Render({ form }) {
    return (
      <Card size="sm" className="bg-linear-to-b from-primary/10 shadow-xs">
        <CardHeader>
          <CardTitle className="font-bold">Units and pricing</CardTitle>
        </CardHeader>

        <form.Subscribe selector={(state) => state.values}>
          {(values) => {
            const { stockUOM, sellUOM, pricingBasis } = values
            const sell = getUnit(sellUOM)?.label || sellUOM || "Unit"
            const isFixed = pricingBasis === "fixed"
            const isCatchWeight = pricingBasis === "catch-weight"
            const units = withCalculatedPrices(values)

            return (
              <CardContent className="space-y-6">
                <FieldGroup className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <form.AppField name="stockUOM">
                    {(field) => (
                      <field.SelectField
                        className="lg:col-span-2"
                        label="Stock unit"
                        options={[...MEASURE_UNITS]}
                      />
                    )}
                  </form.AppField>

                  <form.AppField name="sellUOM">
                    {(field) => (
                      <field.SelectField
                        label="Sold as"
                        options={[...MEASURE_UNITS]}
                      />
                    )}
                  </form.AppField>

                  <form.AppField name="packSize">
                    {(field) => (
                      <field.TextField
                        label={`${sell || "Unit"} contains`}
                        placeholder="35"
                        className="**:data-[slot=input-group-addon]:uppercase"
                        inputMode="decimal"
                        suffix={stockUOM}
                      />
                    )}
                  </form.AppField>

                  <form.AppField name="pricingBasis">
                    {(field) => (
                      <field.RadioField
                        label="Pricing"

                        className="**:data-[slot=field]:py-2.5! **:data-[slot=field-label]:bg-input **:data-[slot=field-label]:has-data-[state=checked]:ring-primary lg:col-span-2"
                        options={[
                          {
                            value: "fixed",
                            label: `Per ${getUnit(sellUOM)?.label?.toLowerCase()}`,
                            description: "One flat price for each unit sold.",
                          },
                          {
                            value: "per-unit",
                            label: `Per ${getUnit(stockUOM)?.label?.toLowerCase()}`,
                            description:
                              "Rate per stock unit, multiplied by the pack size.",
                          },
                          {
                            value: "catch-weight",
                            label: "Catch weight",
                            description:
                              "Billed on actual weight. Prices shown are estimates (~).",
                          },
                        ]}
                      />
                    )}
                  </form.AppField>

                  <form.AppField name="price">
                    {(field) => (
                      <field.TextField
                        label={`Price per ${getUnit(isFixed ? sellUOM : stockUOM)?.label.toLowerCase()}`}
                        placeholder="2.50"
                        className="**:data-[slot=input-group-addon]:uppercase"
                        inputMode="decimal"
                        prefix="$"
                        suffix={`/ ${isFixed ? sellUOM : stockUOM}`}
                      />
                    )}
                  </form.AppField>
                  <form.AppField name="displayLabel">
                    {(field) => (
                      <field.TextField
                        label="Label (optional)"
                        placeholder="5LB Case"
                        className="**:data-[slot=input-group-addon]:uppercase"
                      />
                    )}
                  </form.AppField>
                </FieldGroup>

                {/* split options */}
                <form.Field name="splitUnits" mode="array">
                  {(field) => (
                    <div className="space-y-4">
                      <FieldError errors={field.state.meta.errors} />

                      {field.state.value.map((_, i) => (
                        <div
                          key={i}
                          className="space-y-4 rounded-xl border p-4"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              Split option {i + 1}
                            </span>
                            <Button
                              type="button"
                              size="xs"
                              variant="ghost"
                              onClick={() => field.removeValue(i)}
                            >
                              Remove
                            </Button>
                          </div>

                          <FieldGroup className="grid gap-4 lg:grid-cols-2">
                            <form.AppField name={`splitUnits[${i}].name`}>
                              {(sub) => (
                                <sub.SelectField
                                  label="Sell as"
                                  options={[...MEASURE_UNITS]}
                                />
                              )}
                            </form.AppField>

                            <form.AppField
                              name={`splitUnits[${i}].unitConversion`}
                            >
                              {(sub) => (
                                <sub.TextField
                                  label="Breaks into"
                                  placeholder="7"
                                  inputMode="number"
                                  suffix={`per ${sell.toLowerCase()}`}
                                />
                              )}
                            </form.AppField>

                            <form.AppField
                              name={`splitUnits[${i}].sellUnitPrice`}
                            >
                              {(sub) => (
                                <sub.TextField
                                  label={`${sell} price when split`}
                                  placeholder="60"
                                  className="**:data-[slot=input-group-addon]:uppercase"
                                  inputMode="decimal"
                                  prefix="$"
                                  suffix={`/ ${sellUOM}`}
                                />
                              )}
                            </form.AppField>

                            <form.AppField
                              name={`splitUnits[${i}].displayLabel`}
                            >
                              {(sub) => (
                                <sub.TextField
                                  label="Label (optional)"
                                  placeholder={units[i + 1]?.displayLabel}
                                />
                              )}
                            </form.AppField>
                          </FieldGroup>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full border-dashed"
                        disabled={values.pricingBasis !== "fixed"}
                        onClick={() =>
                          field.pushValue({
                            name: stockUOM,
                            displayLabel: "",
                            sellUnitPrice: "",
                            unitConversion: "",
                          })
                        }
                      >
                        <Plus />
                        {field.state.value.length === 0
                          ? "Split option"
                          : "Add split option"}
                      </Button>
                    </div>
                  )}
                </form.Field>

                {/* preview */}
                <div className="rounded-2xl border-2 border-primary/40 bg-background p-3">
                  <p className="mb-1 text-sm font-medium text-muted-foreground">
                    Customers see
                  </p>
                  <ul className="divide-y">
                    {units.map((unit, i) => (
                      <li key={i} className="flex justify-between gap-3 py-2">
                        <span>{unit.displayLabel}</span>
                        <span className="text-right tabular-nums">
                          <b className="text-primary">
                            {formatUSD(unit.price)}{" "}
                            {values.pricingBasis !== "fixed"
                              ? `/ ${stockUOM}`
                              : ""}
                          </b>
                          {values.pricingBasis !== "fixed" && (
                            <span className="block text-xs text-muted-foreground">
                              {isCatchWeight && "~"}
                              {formatUSD(unit.price)}
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            )
          }}
        </form.Subscribe>
      </Card>
    )
  },
})
