"use client"

import { toast } from "sonner"

import { useRouter } from "next/navigation"
import { useStore } from "@jp/ui/forms/public"

import { steps } from "@/features/careers/manager.steps"
import {
  CareersFormValues,
  jobFormSchema,
} from "@/features/careers/careers.schema"
import { createJobApplication } from "@/features/careers/careers.action"
import { useConfirm } from "@jp/ui/components/jp/confirm-dialog"
import { useAppForm } from "@jp/ui/forms/public"
import { uploadFile } from "@jp/utils/blob/client"
import { DEFAULT_VALUES } from "../careers.const"
import { ApplicationFormLayout } from "../components/application-form-layout"

const defaultValues: CareersFormValues = {
  ...DEFAULT_VALUES,
  step: 5,
  position: "",
}

export const TerritoryManagerForm = ({
  position,
  location,
}: {
  position: string
  location: string
}) => {
  const router = useRouter()
  const { open } = useConfirm()

  const form = useAppForm({
    defaultValues: {
      ...defaultValues,
      position,
      location: ["Alabama", "Louisiana"].includes(location) ? location : "",
    },
    validators: {
      onSubmit: ({ value, formApi }) => {
        return formApi.parseValuesWithSchema(
          (value.step === steps.length - 1
            ? jobFormSchema
            : (steps[value.step]?.schema ??
              jobFormSchema)) as typeof jobFormSchema
        )
      },
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        if (value.step < steps.length - 1)
          formApi.setFieldValue("step", value.step + 1)
        else {
          const files = Object.fromEntries([
            ["dlFront", value.drivingLicenseFront],
            ["dlBack", value.drivingLicenseBack],
            ["dtFront", value.dotFront],
            ["dtBack", value.dotBack],
            ["ssFront", value.socialSecurityFront],
            ["ssBack", value.socialSecurityBack],
            ["sign", value.signature],
          ])

          // upload files
          const [dlFront, dlBack, dtFront, dtBack, ssFront, ssBack, sign] =
            await Promise.all([
              uploadFile({ file: files.dlFront, path: "documents" }),
              uploadFile({ file: files.dlBack, path: "documents" }),
              uploadFile({ file: files.dtFront, path: "documents" }),
              uploadFile({ file: files.dtBack, path: "documents" }),
              uploadFile({ file: files.ssFront, path: "documents" }),
              uploadFile({ file: files.ssBack, path: "documents" }),
              uploadFile({ file: files.sign, path: "documents" }),
            ])

          const {
            drivingLicenseFront,
            drivingLicenseBack,
            dotFront,
            dotBack,
            socialSecurityFront,
            socialSecurityBack,
            signature,
            ...rest
          } = value

          const values = {
            ...rest,
            cvUrl: "",
            drivingLicenseFrontUrl: dlFront.url,
            drivingLicenseBackUrl: dlBack.url,
            dotFrontUrl: dtFront.url,
            dotBackUrl: dtBack.url,
            socialSecurityFrontUrl: ssFront.url,
            socialSecurityBackUrl: ssBack.url,
            signatureUrl: sign.url,
          }

          const { success, error } = await createJobApplication(values)
          if (success) {
            open({
              title: "Application Submitted",
              description: `Your application has been successfully submitted.`,
              action: {
                label: "Back to home",
                action: () => router.push("/"),
              },
            })
            form.reset()
          } else {
            toast.error(error.message)
          }
        }
      } catch (err) {
        console.error(err)
        toast.error(
          "Unable to submit. Please check your uploads and try again."
        )
      }
    },
  })

  const step = useStore(form.store, (state) => state.values.step)

  const CurrentStep = steps[step]!.component

  return (
    <form.Subscribe
      selector={(state) => state.isSubmitting}
      children={(isSubmitting) => (
        <ApplicationFormLayout
          steps={steps}
          step={step}
          isSubmitting={isSubmitting}
          onStepChange={(nextStep) => form.setFieldValue("step", nextStep)}
          onSubmit={(event) => {
            event.preventDefault()
            form.handleSubmit()
          }}
        >
          <CurrentStep form={form} />
        </ApplicationFormLayout>
      )}
    />
  )
}
