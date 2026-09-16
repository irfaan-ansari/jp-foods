import { auth } from "./server"
import {
  inferOrgAdditionalFields,
  inferAdditionalFields,
  adminClient as adminClientPlugin,
  phoneNumberClient as phoneNumberClientPlugin,
  organizationClient as organizationClientPlugin,
} from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import { orgAc, orgRoles } from "./permissions/organization"
import type { AuthQueryAtom } from "better-auth/client"
import { userAc, userRoles } from "./permissions/user"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  basePath: "/api/auth",
  fetchOptions: {
    credentials: "include",
  },
  plugins: [
    adminClientPlugin({
      ac: userAc,
      roles: userRoles,
    }),
    organizationClientPlugin({
      teams: {
        enabled: true,
      },
      ac: orgAc,
      roles: orgRoles,
      schema: inferOrgAdditionalFields<typeof auth>(),
    }),
    phoneNumberClientPlugin(),
  ],
})

export type AuthClient = typeof authClient
