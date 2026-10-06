import type { User } from "@/features/user/user.type"

export type PermissionProps = {
  children: (disabled: boolean, isPending?: boolean) => React.ReactNode
  fallback?: React.ReactNode
}

export type PresenceUser = Pick<
  User,
  "id" | "name" | "email" | "image" | "role" | "lastSeenAt"
>

export type PresenceResponse = {
  success: boolean
  data: PresenceUser[]
}

export type UpdatePresenceResponse = {
  success: boolean
}
