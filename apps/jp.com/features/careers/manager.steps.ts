import { ApplicantDocuments } from "@/features/careers/forms/applicant-documents"
import {
  applicantAddressSchema,
  applicantSchema,
  educationSchema,
  employementSchema,
  licenseSchema,
  documentSchema,
  consentSchema,
} from "@/features/careers/careers.schema"
import { ApplicantEducation } from "@/features/careers/forms/applicant-education"
import { ApplicantExperience } from "@/features/careers/forms/applicant-experience"

import { ApplicantLicense } from "@/features/careers/forms/applicant-license"
import { ApplicantAddress } from "@/features/careers/forms/applicant-address"
import { ApplicantDetails } from "@/features/careers/forms/applicant-details"
import z from "@jp/utils/validation"
import { ApplicantConsent } from "./forms/applicant-consent"

type StepsType = {
  title: string
  description: string
  component: React.ComponentType<any>

  schema: z.ZodObject<any>
}[]

export const steps: StepsType = [
  {
    title: "Applicant Information",
    description:
      "Provide your personal details so we can identify and contact you regarding your application.",
    component: ApplicantDetails,
    schema: applicantSchema,
  },
  {
    title: "Residence Address",
    description:
      "Provide your  residence address, including street, city, state, and ZIP code.",
    component: ApplicantAddress,
    schema: applicantAddressSchema,
  },
  {
    title: "License Information",
    description:
      "Enter your license details, including state of issue and expiration date.",
    component: ApplicantLicense,
    schema: licenseSchema,
  },
  {
    title: "Employment History",
    description:
      "Provide your employment history, including employers, job titles, and dates of employment.",
    component: ApplicantExperience,
    schema: employementSchema,
  },
  {
    title: "Education",
    description:
      "Enter your educational background, including highest level completed.",
    component: ApplicantEducation,
    schema: educationSchema,
  },
  {
    title: "Documents",
    description: "Upload your documents, verify all information is accurate.",
    component: ApplicantDocuments,
    schema: documentSchema,
  },
  {
    title: "Authorization",
    description:
      "Review the background check disclosure, provide your printed and signature, and authorize the background check.",
    component: ApplicantConsent,
    schema: consentSchema,
  },
]
