import { userRoles } from "./user"

export * from "./user"
export * from "./organization"

export const routeConfig: Record<keyof typeof userRoles, string> = {
  developer: "admin",
  admin: "admin",
  superAdmin: "adminroute",
  user: "admin",
  reviewer: "application",
  customer: "customer",
  driver: "driver",
} as const
