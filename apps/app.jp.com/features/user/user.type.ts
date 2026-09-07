import { UserSelectType } from "@jp/db"

export type User = UserSelectType & {
  lastSession: Date | null
}
