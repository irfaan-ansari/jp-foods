import { type JobApplicationSelectType } from "@jp/db"

export const CANDIDATE_APPLICATION_STATUSES = [
  "new",
  "under_verification",
  "agreement_sent",
  "agreement_signed",
  "hired",
  "rejected",
] as const

export type CandidateApplicationStatus =
  (typeof CANDIDATE_APPLICATION_STATUSES)[number]

export type Document = {
  label: string
  field: string
  url: string
}
export type CandidateApplication = Omit<
  JobApplicationSelectType,
  | "status"
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
  status: CandidateApplicationStatus
  documents: Document[]
}

export type CandidateEmailStatus =
  | "agreement_sent"
  | "hired"
  | "rejected"
  | "under_verification"

export type CandidateEmailData = Pick<
  JobApplicationSelectType,
  | "id"
  | "dotBackUrl"
  | "dotFrontUrl"
  | "drivingLicenseBackUrl"
  | "drivingLicenseFrontUrl"
  | "email"
  | "firstName"
  | "location"
  | "phone"
  | "position"
  | "token"
>

export type SendCandidateEmailOptions = {
  candidate: JobApplicationSelectType & { status: CandidateApplicationStatus }
  status: CandidateApplicationStatus | undefined
  statusDetails?: string
  statusReason?: string
  internalNotes?: string
}
