"use client"

import React from "react"

import { OrganizationPermission } from "@jp/auth"
import { PermissionProps } from "../auth.type"
import { useOrgPermission } from "../auth.data"

type OrgAccessProps = PermissionProps & {
  permission: OrganizationPermission
}

export const OrgAccess = ({ permission, children }: OrgAccessProps) => {
  const { data, isPending, isError } = useOrgPermission(permission)

  const disabled = isPending || isError || !data?.success

  return <>{children(disabled, isPending)}</>
}
