import { createAccessControl } from "better-auth/plugins/access"
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access"

const statement = {
  ...defaultStatements,
  portal: ["organization", "crm", "fleet", "customer", "driver"],

  // crm
  "customer-invite": ["create", "read", "delete"],
  "customer-application": ["create", "read", "update", "delete"],
  "candidate-invite": ["create", "read", "delete"],
  "candidate-application": ["create", "read", "update", "delete"],
  "catalog-inquiry": ["read", "update", "delete"],
} as const

const ac = createAccessControl(statement)

const superAdmin = ac.newRole({
  ...adminAc.statements,
  portal: ["organization", "crm"],
  "customer-invite": ["create", "read", "delete"],
  "customer-application": ["create", "read", "update", "delete"],
  "candidate-invite": ["create", "read", "delete"],
  "candidate-application": ["create", "read", "update", "delete"],
  "catalog-inquiry": ["read", "update", "delete"],
})

const developer = ac.newRole({
  ...adminAc.statements,
  portal: ["organization", "crm"],
  "customer-invite": ["create", "read", "delete"],
  "customer-application": ["create", "read", "update", "delete"],
  "candidate-invite": ["create", "read", "delete"],
  "candidate-application": ["create", "read", "update", "delete"],
  "catalog-inquiry": ["read", "update", "delete"],
})

const admin = ac.newRole({
  ...adminAc.statements,
  portal: ["organization", "crm"],
  user: [
    "create",
    "list",
    "impersonate",
    "set-password",
    "set-email",
    "set-role",
    "get",
    "ban",
    "update",
  ],
  session: ["list", "revoke"],

  // temp
  "customer-invite": ["create", "read"],
  "customer-application": ["create", "read", "update"],
  "candidate-invite": ["create", "read"],
  "candidate-application": ["create", "read", "update"],
  "catalog-inquiry": ["read", "update"],
})

const user = ac.newRole({
  ...adminAc.statements,
  portal: ["organization"],
  user: ["list"],
})

const reviewer = ac.newRole({
  ...adminAc.statements,
  portal: ["crm"],
  user: ["list", "set-email"],
  "customer-invite": ["create", "read"],
  "customer-application": ["create", "read", "update"],
  "candidate-invite": ["create", "read"],
  "candidate-application": ["create", "read", "update"],
  "catalog-inquiry": ["read", "update"],
})

const customer = ac.newRole({
  portal: ["customer"],
})

const userRoles = {
  superAdmin,
  admin,
  user,
  reviewer,
  customer,
  developer,
} as const

export { ac as userAc, userRoles }

type AccessStatement = typeof statement

export type UserPermission = {
  [R in keyof AccessStatement]?: AccessStatement[R][number][]
}

export type UserRole = keyof typeof userRoles
