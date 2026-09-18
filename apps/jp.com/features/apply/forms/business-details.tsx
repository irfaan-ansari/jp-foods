import { FieldGroup } from "@jp/ui/components/field"
import { BUSINESS_TYPES } from "@/features/apply/customer.const"
import translations from "@/features/apply/customer.translations.json"
import {
  type Translations,
  useTranslation,
} from "@/components/language-selector"
import { CardDescription, CardTitle } from "@jp/ui/components/card"
import { withForm } from "@/hooks/use-app-form"
import { CustomerFormType } from "../customer.schema"

export const BusinessDetails = withForm({
  defaultValues: {} as CustomerFormType,
  render: function Render({ form }) {
    const { t } = useTranslation(translations as Translations, "en")
    return (
      <>
        <FieldGroup className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <CardTitle className="text-lg">Company Information</CardTitle>
            <CardDescription>
              Enter your company's legal details, tax information, and business
              profile.
            </CardDescription>
          </div>
          <form.AppField
            name="companyName"
            children={(field) => (
              <field.TextField
                label={t[field.name]}
                placeholder={t[`${field.name}Placeholder`]}
                className="**:data-[slot=input]:rounded-2xl"
              />
            )}
          />

          <form.AppField
            name="companyType"
            children={(field) => (
              <field.SelectField
                label={t[field.name]}
                placeholder={t[`${field.name}Placeholder`]}
                options={BUSINESS_TYPES}
                className="**:data-[slot=select-trigger]:rounded-2xl"
              />
            )}
          />
          <form.AppField
            name="companyDBA"
            children={(field) => (
              <field.TextField
                label={t[field.name]}
                placeholder={t[`${field.name}Placeholder`]}
                className="**:data-[slot=input]:rounded-2xl"
              />
            )}
          />
          <form.AppField
            name="companyEin"
            children={(field) => (
              <field.TextField
                label={t[field.name]}
                placeholder={t[`${field.name}Placeholder`]}
                className="**:data-[slot=input]:rounded-2xl"
              />
            )}
          />
          <form.AppField
            name="companyPhone"
            children={(field) => (
              <field.TextField
                label={t[field.name]}
                placeholder={t[`${field.name}Placeholder`]}
                className="**:data-[slot=input]:rounded-2xl"
              />
            )}
          />
          <form.AppField
            name="companyEmail"
            children={(field) => (
              <field.TextField
                label={t[field.name]}
                placeholder={t[`${field.name}Placeholder`]}
                className="**:data-[slot=input]:rounded-2xl"
              />
            )}
          />
          <div className="lg:col-span-2">
            <CardTitle className="text-lg">Company Address</CardTitle>
            <CardDescription>
              Provide the official address associated with your company.
            </CardDescription>
          </div>

          <form.AppField
            name="companyStreet"
            children={(field) => (
              <field.TextField
                label={t[field.name]}
                placeholder={t[`${field.name}Placeholder`]}
                className="**:data-[slot=input]:rounded-2xl"
              />
            )}
          />
          <form.AppField
            name="companyCity"
            children={(field) => (
              <field.TextField
                label={t[field.name]}
                placeholder={t[`${field.name}Placeholder`]}
                className="**:data-[slot=input]:rounded-2xl"
              />
            )}
          />
          <form.AppField
            name="companyState"
            children={(field) => (
              <field.TextField
                label={t[field.name]}
                placeholder={t[`${field.name}Placeholder`]}
                className="**:data-[slot=input]:rounded-2xl"
              />
            )}
          />
          <form.AppField
            name="companyZip"
            children={(field) => (
              <field.TextField
                label={t[field.name]}
                placeholder={t[`${field.name}Placeholder`]}
                className="**:data-[slot=input]:rounded-2xl"
              />
            )}
          />
        </FieldGroup>
      </>
    )
  },
})
