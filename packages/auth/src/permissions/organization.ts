import {
  adminAc,
  defaultStatements,
} from "better-auth/plugins/organization/access"
import { createAccessControl } from "better-auth/plugins/access"

const statement = {
  ...defaultStatements,
  team: ["create", "read", "update", "delete"],
  member: ["create", "read", "update", "delete"],
  invitation: ["create", "read", "cancel"],

  order: ["create", "read", "update", "cancel", "delete"],
  product: ["create", "read", "update", "delete", "import", "export"],
  priceList: ["read", "update"],
  priceLevel: ["create", "read", "update", "delete"],
  taxRule: ["create", "read", "update", "delete"],
  orderGuide: ["create", "read", "update", "delete"],
  promotion: ["create", "read", "update", "delete"],
  messaging: ["create", "read", "send", "delete"],
} as const

const ac = createAccessControl(statement)

const owner = ac.newRole({
  ...adminAc.statements,
  organization: ["update", "delete"],
  team: ["create", "read", "update", "delete"],
  member: ["create", "read", "update", "delete"],
  invitation: ["create", "read", "cancel"],

  order: ["create", "read", "update", "cancel", "delete"],
  product: ["create", "update", "read", "delete", "import", "export"],
  priceList: ["read", "update"],
  priceLevel: ["create", "read", "update", "delete"],
  taxRule: ["create", "read", "update", "delete"],
  orderGuide: ["create", "read", "update", "delete"],
  promotion: ["create", "read", "update", "delete"],
  messaging: ["create", "read", "send", "delete"],
})

const manager = ac.newRole({
  ...adminAc.statements,
  organization: ["update"],
  team: ["create", "read", "update", "delete"],
  member: ["create", "read", "update", "delete"],
  invitation: ["create", "read", "cancel"],

  order: ["read", "update"],
  product: ["create", "read", "update", "delete", "import", "export"],
  priceList: ["read", "update"],
  priceLevel: ["create", "read", "update"],
  taxRule: ["create", "read", "update"],
  orderGuide: ["create", "read", "update"],
  promotion: ["create", "read", "update"],
  messaging: ["create", "read", "send"],
})

const sales = ac.newRole({
  team: ["read"],
  member: ["read"],

  order: ["read", "update"],
  product: ["create", "read", "update", "delete", "import", "export"],
  priceList: ["read", "update"],
  priceLevel: ["create", "read", "update"],
  taxRule: ["create", "read", "update"],
  orderGuide: ["create", "read", "update"],
  messaging: ["create", "read", "send"],
})

const customer = ac.newRole({
  team: ["read", "update"],
  member: ["read"],
  invitation: ["create", "read"],
  product: ["read"],
  order: ["create", "read", "update", "cancel"],
  orderGuide: ["read"],
})

const orgRoles = {
  owner,
  manager,
  sales,
  customer,
} as const

type AccessStatement = typeof statement

export type OrganizationPermission = {
  [R in keyof AccessStatement]?: AccessStatement[R][number][]
}
export type OrganizationRole = keyof typeof orgRoles

export { ac as orgAc, orgRoles }
