import { FieldGroup } from "@jp/ui/components/field"
import { ROLES, SALES_REPRESENTATIVE } from "@/features/apply/customer.const"

import translations from "@/features/apply/customer.translations.json"
import {
  type Translations,
  useTranslation,
} from "@/components/language-selector"
import { CardDescription, CardTitle } from "@jp/ui/components/card"
import { withForm } from "@/hooks/use-app-form"
import { CustomerFormType } from "../customer.schema"

export const BusinessAdditionalContact = withForm({
  defaultValues: {} as CustomerFormType,
  render: function render({ form }) {
    const { t } = useTranslation(translations as Translations, "en")
    return (
      <FieldGroup className="grid grid-cols-1 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <CardTitle className="text-lg">Additional Contact</CardTitle>
          <CardDescription>
            Enter the details of the individual who will personally guarantee
            payment on this account.
          </CardDescription>
        </div>
        <form.AppField
          name="orderingName"
          children={(field) => (
            <field.TextField
              label={t[field.name]}
              placeholder={t[`${field.name}Placeholder`]}
              className="**:data-[slot=input]:rounded-2xl lg:col-span-2"
            />
          )}
        />
        <form.AppField
          name="orderingPhone"
          children={(field) => (
            <field.TextField
              label={t[field.name]}
              placeholder={t[`${field.name}Placeholder`]}
              className="**:data-[slot=input]:rounded-2xl"
            />
          )}
        />
        <form.AppField
          name="accountPayableEmail"
          children={(field) => (
            <field.TextField
              label={t[field.name]}
              placeholder={t[`${field.name}Placeholder`]}
              className="**:data-[slot=input]:rounded-2xl"
            />
          )}
        />
        <div className="lg:col-span-2">
          <CardTitle className="text-lg">Personal Guarantor</CardTitle>
          <CardDescription>
            Enter the details of the individual who will personally guarantee
            payment on this account.
          </CardDescription>
        </div>
        <form.AppField
          name="guarantorName"
          children={(field) => (
            <field.TextField
              label={t[field.name]}
              placeholder={t[`${field.name}Placeholder`]}
              className="**:data-[slot=input]:rounded-2xl"
            />
          )}
        />

        <form.AppField
          name="guarantorRole"
          children={(field) => (
            <field.SelectField
              options={ROLES}
              label={t[field.name]}
              placeholder={t[`${field.name}Placeholder`]}
              className="**:data-[slot=select-trigger]:rounded-2xl"
            />
          )}
        />

        <form.AppField
          name="salesRepresentative"
          children={(field) => (
            <field.SelectField
              label={t[field.name]}
              description={t[`${field.name}Desc`]}
              className="col-span-2 **:data-[slot=select-trigger]:rounded-2xl"
              options={SALES_REPRESENTATIVE}
              placeholder={t[`${field.name}Placeholder`]}
            />
          )}
        />
      </FieldGroup>
    )
  },
})
