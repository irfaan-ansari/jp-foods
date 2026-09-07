"use client"

import React from "react"

import { UserPermission } from "@jp/auth"
import { PermissionProps } from "@/features/shared/shared.type"
import { useUserPermission } from "../auth.data"

type UserAccessProps = PermissionProps & {
  permission: UserPermission
}

export const UserAccess = ({ permission, children }: UserAccessProps) => {
  const { data, isPending, isError } = useUserPermission(permission)

  const disabled = isPending || isError || !data?.data?.success

  return <>{children(disabled, isPending)}</>
}
