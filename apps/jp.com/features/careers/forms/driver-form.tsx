"use client"

import { toast } from "sonner"
import {
  applicantAccidentHistory,
  applicantAddress,
  applicantConfirmation,
  applicantDetail,
  applicantDrivingExperience,
  applicantEducation,
  applicantExperience,
  applicantLicence,
  applicantTrafficConvictions,
} from "@/features/careers/careers.const"
import { Button } from "@jp/ui/components/button"
import { useRouter } from "next/navigation"
import { upload } from "@vercel/blob/client"
import { useStore } from "@tanstack/react-form"

import { createJobApplication } from "@/features/careers/careers.action"
import { steps } from "@/features/careers/driver.steps"
import { ArrowLeft, ArrowRight, Loader } from "lucide-react"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@jp/ui/components/tabs"
import {
  driverFormSchema,
  DriverFormType,
} from "@/features/careers/careers.schema"
import { useConfirm } from "@jp/ui/components/jp/confirm-dialog"
import { useAppForm } from "@/hooks/use-app-form"

const defaultValues: DriverFormType = {
  ...applicantAccidentHistory,
  ...applicantAddress,
  ...applicantConfirmation,
  ...applicantDetail,
  ...applicantDrivingExperience,
  ...applicantEducation,
  ...applicantExperience,
  ...applicantLicence,
  ...applicantTrafficConvictions,
  step: 0,
  position: "Route Driver",
}

export const DriverForm = ({
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
      location,
      position,
    },
    validators: {
      onSubmit: ({ value, formApi }) => {
        return formApi.parseValuesWithSchema(
          (value.step === steps.length - 1
            ? driverFormSchema
            : (steps[value.step]?.schema ??
              driverFormSchema)) as typeof driverFormSchema
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
              uploadFile(files.dlFront),
              uploadFile(files.dlBack),
              uploadFile(files.dtFront),
              uploadFile(files.dtBack),
              uploadFile(files.ssFront),
              uploadFile(files.ssBack),
              uploadFile(files.sign),
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
              variant: "default",
              title: "Application Submitted Successfully",
              description: `Your application has been successfully submitted and is now under review. 
            If additional information is required, our team will contact you.`,

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
      } catch {
        toast.error(
          "Unable to submit. Please check your uploads and try again."
        )
      }
    },
  })

  const step = useStore(form.store, (state) => state.values.step)

  return (
    <Tabs value={step.toString()}>
      <TabsList className="mb-8 w-full gap-2 bg-background p-0">
        {steps.map((s, i) => (
          <TabsTrigger
            key={s.title}
            value={i.toString()}
            aria-label={s.title}
            disabled={i > step}
            onClick={() => form.setFieldValue("step", i)}
            className="group h-auto justify-start p-0 shadow-none!"
            data-completed={step >= i}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6 group-data-[completed=true]:text-primary"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
            </svg>
            <span className="relative h-1 flex-1 rounded-full bg-muted-foreground after:absolute after:inset-0 after:origin-left after:scale-x-0 after:rounded-full after:transition group-data-[completed=true]:after:scale-x-100 group-data-[completed=true]:after:bg-primary" />
          </TabsTrigger>
        ))}
      </TabsList>

      <form
        className="@container mb-16"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        {steps.map((step, i) => (
          <TabsContent value={i.toString()} key={step.title}>
            <h4 className="mb-1 text-xl font-semibold">{step.title}</h4>
            <p className="mb-4 text-muted-foreground">{step.description}</p>

            <step.component
              // @ts-ignore
              form={form}
            />
          </TabsContent>
        ))}

        {/* submit and preview */}
        <div className="mt-8 flex items-center justify-end gap-4">
          {/* previous button */}
          {step > 0 && step < steps.length && (
            <Button
              size="xl"
              className="min-w-32"
              type="button"
              variant="secondary"
              onClick={() => form.setFieldValue("step", step - 1)}
            >
              <ArrowLeft />
              Previous
            </Button>
          )}

          {/* submit button */}
          <form.Subscribe
            children={({ isSubmitting }) => (
              <Button
                size="xl"
                className="min-w-32"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader className="animate-spin" />}
                {step < steps.length - 1 ? "Next" : "Submit"}
                {step < steps.length && <ArrowRight />}
              </Button>
            )}
          />
        </div>
      </form>
    </Tabs>
  )
}
