import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@jp/ui/components/field"

import { withForm } from "@jp/ui/forms/public"
import { DriverFormValues } from "../careers.schema"
import { Checkbox } from "@jp/ui/components/checkbox"

export const ApplicantConsent = withForm({
  defaultValues: {} as DriverFormValues,
  render: function Render({ form }) {
    return (
      <FieldGroup>
        <form.AppField
          name="applicantName"
          children={(field) => (
            <field.TextField label="Applicant Name (Printed)" />
          )}
        />

        <form.AppField
          name="signature"
          children={(field) => (
            <field.SignatureField
              label="Applicant Signature"
              description="Use mouse or finger (touchscreen)"
            />
          )}
        />
        <form.Field
          name="declaration"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid

            return (
              <Field data-invalid={isInvalid}>
                <Field className="gap-6">
                  <FieldContent className="gap-4">
                    <FieldTitle className="text-foreground">
                      Disclosure Regarding Background Investigation
                    </FieldTitle>
                    <FieldDescription className="space-y-3 text-sm leading-6">
                      <p>
                        Jimenez Produce LLC (&quot;the Company&quot;) may obtain
                        information about you from a third party consumer
                        reporting agency for employment purposes. Thus, you may
                        be the subject of a &quot;consumer report&quot; and/or
                        an &quot;investigative consumer report&quot; which may
                        include information about your character, general
                        reputation, personal characteristics, and/or mode of
                        living, and which can involve personal interviews with
                        sources such as your neighbors, friends, or associates.
                      </p>
                      <p>
                        These reports may contain information regarding your
                        credit history, criminal history, social security
                        verification, motor vehicle records (&quot;driving
                        records&quot;), verification of your education or
                        employment history, or other background checks. Credit
                        history will only be requested where such information is
                        substantially related to the duties and responsibilities
                        of the position for which you are applying.
                      </p>
                      <p>
                        You have the right, upon written request made within a
                        reasonable time, to request whether a consumer report
                        has been run about you, and disclosure of the nature and
                        scope of any investigative consumer report and to
                        request a copy of your report. Please be advised that
                        the nature and scope of the most common form of
                        investigative consumer report is an employment history
                        or verification. These searches will be conducted by
                        Asurint, P.O. Box 14730, Cleveland, OH 44114,
                        800-906-2034, www.asurint.com. The scope of this
                        disclosure is all-encompassing, however, allowing the
                        Company to obtain from any outside organization all
                        manner of consumer reports throughout the course of your
                        employment to the extent permitted by law.
                      </p>
                    </FieldDescription>
                  </FieldContent>

                  <FieldContent className="gap-4">
                    <FieldTitle className="text-foreground">
                      Acknowledgment and Authorization for Background Check
                    </FieldTitle>
                    <FieldDescription className="space-y-3 text-sm leading-6">
                      <p>
                        I acknowledge receipt of the above document entitled
                        DISCLOSURE REGARDING BACKGROUND INVESTIGATION and
                        certify that I have read and understand both of those
                        documents. I hereby authorize the obtaining of
                        &quot;consumer reports&quot; and/or &quot;investigative
                        consumer reports&quot; by Jimenez Produce LLC at any
                        time after receipt of this authorization and throughout
                        my employment, as allowable by applicable law.
                      </p>
                      <p>
                        To this end, I hereby authorize, without reservation,
                        any law enforcement agency, administrator, state or
                        federal agency, institution, school or university
                        (public or private), information service bureau,
                        employer, or insurance company to furnish any and all
                        background information requested by Asurint, P.O. Box
                        14730, Cleveland, OH 44114, 800-906-2034,
                        https://www.asurint.com/webdocs/asurint_web_site_privacy.pdf
                        and/or Jimenez Produce LLC. I agree that a facsimile
                        (&quot;fax&quot;), electronic or photographic copy of
                        this Authorization shall be as valid as the original and
                        I agree to receive any notices, relating to my
                        background check, electronically.
                      </p>
                    </FieldDescription>
                  </FieldContent>

                  <FieldLabel
                    aria-invalid={isInvalid}
                    className="aria-invalid:border-destructive/50"
                  >
                    <Field orientation="horizontal">
                      <Checkbox
                        id={field.name}
                        onCheckedChange={(checked) =>
                          field.handleChange(checked as boolean)
                        }
                      />
                      <FieldContent>
                        <FieldTitle className="text-foreground">
                          I agree to the background check authorization
                        </FieldTitle>
                        <FieldDescription>
                          I have read and understand the disclosure above, and I
                          authorize Jimenez Produce LLC and Asurint to obtain
                          consumer reports for employment purposes as permitted
                          by law. I understand this electronic acknowledgment
                          has the same effect as my signed authorization.
                        </FieldDescription>
                      </FieldContent>
                    </Field>
                  </FieldLabel>
                </Field>

                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />
      </FieldGroup>
    )
  },
})
