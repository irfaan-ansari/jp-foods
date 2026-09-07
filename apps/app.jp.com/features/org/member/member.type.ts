import { MemberSelectType, TeamSelectType, UserSelectType } from "@jp/db"

export type Member = MemberSelectType & {
  user: UserSelectType
  accounts: Pick<TeamSelectType, "id" | "name" | "logo">[]
  lastSession: Date | null
}
