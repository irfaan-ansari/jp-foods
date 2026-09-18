import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@jp/ui/components/field"
import { Checkbox } from "@jp/ui/components/checkbox"

import translations from "@/features/apply/customer.translations.json"
import { businessAuthorization } from "@/features/apply/customer.const"
import {
  type Translations,
  useTranslation,
} from "@/components/language-selector"
import { withForm } from "@/hooks/use-app-form"

export const Authorization = withForm({
  defaultValues: businessAuthorization,
  render: function Render({ form }) {
    const { t } = useTranslation(translations as Translations, "en")
    return (
      <FieldGroup className="grid grid-cols-1 lg:grid-cols-2">
        <form.AppField
          name="signatureName"
          children={(field) => (
            <field.TextField
              label={t[field.name]}
              className="**:data-[slot=input]:rounded-2xl lg:col-span-2"
              placeholder={t[`${field.name}Placeholder`]}
              description={t[`${field.name}Desc`]}
            />
          )}
        />
        <form.AppField
          name="signature"
          children={(field) => (
            <field.SignatureField
              label={t[field.name]}
              className="**:data-[slot=button]:rounded-2xl lg:col-span-2 **:[.border-dashed]:rounded-2xl **:[canvas]:rounded-xl"
              description={t[`${field.name}Desc`]}
            />
          )}
        />
        <form.Field
          name="acknowledge"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid

            return (
              <Field className="gap-2 lg:col-span-2" data-invalid={isInvalid}>
                <FieldLabel className="rounded-2xl!">
                  <Field orientation="horizontal">
                    <Checkbox
                      id={field.name}
                      onCheckedChange={(checked) =>
                        field.handleChange(checked as boolean)
                      }
                    />
                    <FieldContent>
                      <FieldTitle className="text-foreground">
                        {t[field.name]}
                      </FieldTitle>
                      <FieldDescription>
                        {t[`${field.name}Desc`]}
                      </FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldLabel>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />
        <form.Field
          name="consent"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid

            return (
              <Field className="gap-2 lg:col-span-2" data-invalid={isInvalid}>
                <FieldLabel className="rounded-2xl!">
                  <Field orientation="horizontal">
                    <Checkbox
                      id={field.name}
                      onCheckedChange={(checked) =>
                        field.handleChange(checked as boolean)
                      }
                    />
                    <FieldContent>
                      <FieldDescription>
                        {t[`${field.name}Desc`]}
                      </FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldLabel>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />
      </FieldGroup>
    )
  },
})
