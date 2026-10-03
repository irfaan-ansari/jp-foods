import { BadgeStatus } from "@/features/shared/shared.type"

export const APPLICATION_REJECTION_REASONS = [
  "Incomplete application",
  "Required documents not provided",
  "Verification requirements not met",
  "Eligibility requirements not met",
  "Information could not be verified",
  "Other",
] as const

export const APPLICATION_STATUS: Record<string, BadgeStatus> = {
  all: {
    label: "All",
    value: "",
    color: "#A1A1AA",
  },
  new: {
    label: "New",
    value: "new",
    color: "#3B82F6",
  },
  // under_verification
  verification_in_progress: {
    label: "Under Verification",
    value: "under_verification",
    color: "#F59E0B",
  },
  // agreement_sent
  pending: {
    label: "Agreement Sent",
    value: "pending",
    color: "#8B5CF6",
  },
  // agreement_signed
  agreement_signed: {
    label: "Agreement Signed",
    value: "agreement_signed",
    color: "#14B8A6",
  },
  hired: {
    label: "Hired",
    value: "hired",
    color: "#22C55E",
  },
  rejected: {
    label: "Rejected",
    value: "rejected",
    color: "#EF4444",
  },
}
