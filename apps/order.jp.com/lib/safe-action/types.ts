import { AuthType } from "@jp/auth"

export type AuthContext = {
  user: NonNullable<AuthType["user"]>
  session: NonNullable<AuthType["session"]>
}

export type OrgAuthContext = {
  user: NonNullable<AuthType["user"]>
  session: NonNullable<AuthType["session"]>
  organizationId: NonNullable<AuthType["session"]>["activeOrganizationId"]
  teamId: NonNullable<AuthType["session"]>["activeTeamId"]
}
