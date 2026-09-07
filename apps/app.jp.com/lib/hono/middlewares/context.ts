import type { AuthType } from "@jp/auth"

export type AppContext = {
  Variables: AuthType
}

export type OrgAppContext = {
  Variables: AuthType & {
    organizationId: string
    role: string
  }
}

export type TeamAppContext = {
  Variables: AuthType & {
    organizationId: string
    teamId: string
    role: string
  }
}
