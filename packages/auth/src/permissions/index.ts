export * from "./user"
export * from "./organization"

const ORG = process.env.JP_PORTAL_URL_ADMIN + "/org/dashboard"
const CRM = process.env.JP_PORTAL_URL_ADMIN + "/crm/dashboard"
const CUSTOMER = process.env.JP_PORTAL_URL_CUSTOMER

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
