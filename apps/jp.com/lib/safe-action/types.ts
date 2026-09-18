import { AuthType } from "@jp/auth"

export type AuthContext = {
  user: NonNullable<AuthType["user"]>
  session: NonNullable<AuthType["session"]>
}
