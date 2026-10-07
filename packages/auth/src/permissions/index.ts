import { env } from "@jp/utils/env"

export * from "./user"
export * from "./organization"

const ORG = env.NEXT_PUBLIC_ADMIN_URL + "/org/dashboard"
const CRM = env.NEXT_PUBLIC_ADMIN_URL + "/crm/dashboard"
const CUSTOMER = env.NEXT_PUBLIC_CUSTOMER_URL

export const PORTAL_URLS = {
  superAdmin: {
    url: ORG,
    requireOrg: true,
    requireTeam: false,
  },
  admin: {
    url: ORG,
    requireOrg: true,
    requireTeam: false,
  },
  user: {
    url: ORG,
    requireOrg: true,
    requireTeam: false,
  },
  reviewer: {
    url: CRM,
    requireOrg: true,
    requireTeam: false,
  },
  developer: {
    url: CRM,
    requireOrg: true,
    requireTeam: false,
  },
  // ordering
  customer: {
    url: CUSTOMER,
    requireOrg: true,
    requireTeam: true,
  },
} as const
