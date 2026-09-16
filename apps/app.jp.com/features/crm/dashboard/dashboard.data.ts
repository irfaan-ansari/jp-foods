"use client"

import { useCount } from "@/features/shared/shared.data"
import { useCustomerApplications } from "../customer/customer.data"
import { useCandidateApplications } from "../candidate/candidate.data"
import { useCatalogInquiries } from "../catalog/catalog.data"
import { DASHBOARD_SECTIONS, RECENT_APPLICATION_LIMIT } from "./dashboard.const"
import { getDashboardCount } from "./dashboard.utils"
import type { RecentSubmission } from "./dashboard.type"

export function useDashboard() {
  const customersCount = useCount(DASHBOARD_SECTIONS.customers.countPath)
  const candidatesCount = useCount(DASHBOARD_SECTIONS.candidates.countPath)
  const catalogCount = useCount(DASHBOARD_SECTIONS.catalog.countPath)
  const customers = useCustomerApplications({ limit: RECENT_APPLICATION_LIMIT })

  const candidates = useCandidateApplications({
    limit: RECENT_APPLICATION_LIMIT,
  })

  const catalog = useCatalogInquiries({ limit: RECENT_APPLICATION_LIMIT })

  const sections = [
    {
      key: "customers",
      config: DASHBOARD_SECTIONS.customers,
      counts: customersCount,
      query: customers,
      items:
        customers.data?.data.map((item): RecentSubmission => ({
          id: item.id,
          name: item.companyName,
          status: item.status,
          createdAt: item.createdAt,
          href: `${DASHBOARD_SECTIONS.customers.href}/${item.id}`,
        })) ?? [],
    },
    {
      key: "candidates",
      config: DASHBOARD_SECTIONS.candidates,
      counts: candidatesCount,
      query: candidates,
      items:
        candidates.data?.data.map((item): RecentSubmission => ({
          id: item.id,
          name: item.applicantName,
          status: item.status,
          createdAt: item.createdAt,
          href: `${DASHBOARD_SECTIONS.candidates.href}/${item.id}`,
        })) ?? [],
    },
    {
      key: "catalog",
      config: DASHBOARD_SECTIONS.catalog,
      counts: catalogCount,
      query: catalog,
      items:
        catalog.data?.data.map((item): RecentSubmission => ({
          id: item.id,
          name: item.companyName || `${item.firstName} ${item.lastName}`,
          status: item.status,
          createdAt: item.createdAt,
          href: `${DASHBOARD_SECTIONS.catalog.href}?q=${encodeURIComponent(item.email)}`,
        })) ?? [],
    },
  ]
  const queries = [
    customersCount,
    candidatesCount,
    catalogCount,
    customers,
    candidates,
    catalog,
  ]
  return {
    sections,
    pending: sections.reduce(
      (sum, section) => sum + getDashboardCount(section.counts.data?.data.new),
      0
    ),
    countsPending: sections.some((section) => section.counts.isPending),
    countsError: sections.some((section) => section.counts.isError),
    isFetching: queries.some((query) => query.isFetching),
    refresh: () => Promise.all(queries.map((query) => query.refetch())),
  }
}
