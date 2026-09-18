import { FieldGroup } from "@jp/ui/components/field"

import translations from "@/features/apply/customer.translations.json"

import {
  type Translations,
  useTranslation,
} from "@/components/language-selector"
import { withForm } from "@/hooks/use-app-form"
import { CustomerFormType } from "../customer.schema"

export const Documents = withForm({
  defaultValues: {} as CustomerFormType,
  render: function Render({ form }) {
    const { t } = useTranslation(translations as Translations, "en")
    return (
      <FieldGroup className="grid grid-cols-1 lg:grid-cols-2">
        <div className="rounded-2xl border border-amber-600/10 bg-amber-600/10 p-4 font-medium text-amber-600 lg:col-span-2">
          All uploaded files must be in PDF, JPG, or PNG format and must not
          exceed 5 MB per file.
        </div>

        <form.AppField
          name="certificate"
          children={(field) => (
            <field.FileField label={t[field.name]} className="lg:col-span-2" />
          )}
        />

        <form.AppField
          name="dlFront"
          children={(field) => (
            <field.FileField label={t[field.name]} className="lg:col-span-2" />
          )}
        />
        <form.AppField
          name="dlBack"
          children={(field) => (
            <field.FileField label={t[field.name]} className="lg:col-span-2" />
          )}
        />
      </FieldGroup>
    )
  },
})
