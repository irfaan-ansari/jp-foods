import { type JobApplicationSelectType } from "@jp/db"

export type Document = {
  label: string
  field: string
  url: string
}
export type CandidateApplication = Omit<
  JobApplicationSelectType,
  | "cvUrl"
  | "dotBackUrl"
  | "dotFrontUrl"
  | "agreementUrl"
  | "signatureUrl"
  | "drivingLicenseBackUrl"
  | "drivingLicenseFrontUrl"
  | "socialSecurityBackUrl"
  | "socialSecurityFrontUrl"
> & {
  documents: Document[]
}
