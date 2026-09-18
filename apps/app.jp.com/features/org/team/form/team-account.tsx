import { ChevronDown } from "lucide-react"
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
import { withForm } from "@/hooks/use-app-form"
import { TeamFormValues } from "../team.schema"
import { Button } from "@jp/ui/components/button"
import { Switch } from "@jp/ui/components/switch"
import { TaxRuleSelector } from "@/features/org/tax-rule/components/tax-rule-selector"
import { PriceLevelSelector } from "@/features/org/price-level/components/price-level-selector"
import { UserSelector } from "@/features/user/components/user-selector"

export const TeamAccount = withForm({
  defaultValues: {} as TeamFormValues,
  render: ({ form }) => {
    return (
      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-base font-bold">
            Account & Pricing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup className="grid md:grid-cols-2">
            <Field
              orientation="vertical"
              className="rounded-2xl border p-4 md:col-span-2"
            >
              <form.Field
                name="creditEnabled"
                children={(field) => (
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor={field.name} className="flex-1">
                      <FieldContent>
                        <FieldTitle>Enable Customer Credit</FieldTitle>
                        <FieldDescription>
                          Allow this customer to order on credit. If disabled,
                          payment will be required when placing an order.
                        </FieldDescription>
                      </FieldContent>
                    </FieldLabel>
                    <Switch
                      id={field.name}
                      checked={field.state.value}
                      onCheckedChange={field.handleChange}
                    />
                  </div>
                )}
              />
              <form.Subscribe
                selector={(state) => state.values.creditEnabled}
                children={(enabled) => (
                  <form.AppField
                    name="creditLimit"
                    children={(field) => (
                      <field.TextField
                        className={enabled ? "" : "hidden"}
                        prefix="$"
                        inputMode="decimal"
                        label="Credit Limit"
                        placeholder="2,000"
                        description="Leave empty for unlimited credit"
                      />
                    )}
                  />
                )}
              />
            </Field>

            <form.AppField
              name="priceLevel"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Price Level</FieldLabel>
                  <PriceLevelSelector
                    selected={field.state.value?.id as number}
                    setSelectedChange={(value) => {
                      field.handleChange({ id: value.id, name: value.name })
                    }}
                  >
                    <Button
                      className="justify-start"
                      variant="outline"
                      id={field.name}
                    >
                      {field.state.value?.name || "Select..."}
                      <ChevronDown className="ml-auto" />
                    </Button>
                  </PriceLevelSelector>
                </Field>
              )}
            />

            <form.AppField
              name="taxRule"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Tax Rule</FieldLabel>
                  <TaxRuleSelector
                    selected={field.state.value?.id as number}
                    setSelectedChange={(value) => {
                      field.handleChange({ id: value.id, name: value.name })
                    }}
                  >
                    <Button
                      className="justify-start"
                      variant="outline"
                      id={field.name}
                    >
                      {field.state.value?.name || "Select..."}
                      <ChevronDown className="ml-auto" />
                    </Button>
                  </TaxRuleSelector>
                </Field>
              )}
            />
            <form.AppField
              name="salesRep"
              children={(field) => (
                <Field className="lg:col-span-2">
                  <FieldLabel htmlFor={field.name}>
                    Sales Representative
                  </FieldLabel>
                  <UserSelector
                    role="sales"
                    selected={field.state.value?.id as string}
                    setSelectedChange={(value) => {
                      field.handleChange({ id: value.id, name: value.name })
                    }}
                  >
                    <Button
                      className="justify-start"
                      variant="outline"
                      id={field.name}
                    >
                      {field.state.value?.name || "Select..."}
                      <ChevronDown className="ml-auto" />
                    </Button>
                  </UserSelector>
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>
      </Card>
    )
  },
})
