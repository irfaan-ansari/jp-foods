import { withForm } from "@/hooks/use-app-form"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@jp/ui/components/card"
import { FieldGroup } from "@jp/ui/components/field"
import { Letter, Smartphone } from "@solar-icons/react"
import { type TeamFormValues } from "../team.schema"

export const TeamGeneral = withForm({
  defaultValues: {} as TeamFormValues,
  render: ({ form }) => {
    return (
      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-base font-bold">General</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup className="grid md:grid-cols-2">
            <form.AppField
              name="name"
              children={(field) => (
                <field.TextField
                  className="md:col-span-2"
                  label="Company Name"
                  placeholder="Company name"
                />
              )}
            />

            <form.AppField
              name="managerName"
              children={(field) => (
                <field.TextField
                  className="md:col-span-2"
                  label="Manager Name"
                  placeholder="Manager name"
                />
              )}
            />

            <form.AppField
              name="phoneNumber"
              children={(field) => (
                <field.TextField
                  label="Phone Number"
                  prefix={<Smartphone className="size-4" />}
                  placeholder="+1 234 567 8900"
                />
              )}
            />

            <form.AppField
              name="email"
              children={(field) => (
                <field.TextField
                  label="Email"
                  prefix={<Letter className="size-4" />}
                  placeholder="name@company.com"
                />
              )}
            />
            <form.AppField
              name="street"
              children={(field) => (
                <field.TextField
                  label="Street Address"
                  placeholder="123 Example Street"
                />
              )}
            />

            <form.AppField
              name="city"
              children={(field) => (
                <field.TextField label="City" placeholder="Austin" />
              )}
            />

            <form.AppField
              name="state"
              children={(field) => (
                <field.TextField label="State" placeholder="Texas" />
              )}
            />

            <form.AppField
              name="zip"
              children={(field) => (
                <field.TextField label="ZIP Code" placeholder="78701" />
              )}
            />
          </FieldGroup>
        </CardContent>
      </Card>
    )
  },
})
