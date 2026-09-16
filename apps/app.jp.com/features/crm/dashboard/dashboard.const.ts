import { Buildings2, Tag, UsersGroupRounded } from "@solar-icons/react"
import { APPLICATION_STATUS as customerStatuses } from "../customer/customer.const"
import { APPLICATION_STATUS as candidateStatuses } from "../candidate/candidate.const"
import { STATUS as catalogStatuses } from "../catalog/catalog.const"
import { CustomerApplicationBadge } from "../customer/components/customer-card"
import { CandidateApplicationBadge } from "../candidate/components/candidate-card"
import { CatalogInquiryBadge } from "../catalog/components/catalog-card"

export const RECENT_APPLICATION_LIMIT = 8

export const DASHBOARD_SECTIONS = {
  customers: {
    title: "Customer applications",
    href: "/crm/application/customers",
    countPath: "/crm/customers/count",
    icon: Buildings2,
    iconClassName: "text-rose-500",
    badge: CustomerApplicationBadge,
    segments: [
      customerStatuses.new!,
      customerStatuses.active!,
      customerStatuses.rejected!,
    ],
  },
  candidates: {
    title: "Candidate applications",
    href: "/crm/application/candidates",
    countPath: "/crm/candidates/count",
    icon: UsersGroupRounded,
    iconClassName: "text-emerald-500",
    badge: CandidateApplicationBadge,
    segments: [
      candidateStatuses.new!,
      candidateStatuses.verification_in_progress!,
      candidateStatuses.rejected!,
    ],
  },
  catalog: {
    title: "Catalog inquiries",
    href: "/crm/application/catalog",
    countPath: "/crm/catalog-inquiries/count",
    icon: Tag,
    iconClassName: "text-sky-500",
    badge: CatalogInquiryBadge,
    segments: [
      catalogStatuses.new!,
      catalogStatuses.approved!,
      catalogStatuses.rejected!,
    ],
  },
}
