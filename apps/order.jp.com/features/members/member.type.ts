import { TeamMemberSelectType, UserSelectType } from "@jp/db"

export type Member = TeamMemberSelectType & {
  user: UserSelectType
  lastActive: Date | null
}
