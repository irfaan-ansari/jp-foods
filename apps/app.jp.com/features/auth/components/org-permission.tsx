"use client"

import React from "react"

import { OrganizationPermission } from "@jp/auth"
import { PermissionProps } from "@/features/shared/shared.type"
import { useOrgPermission } from "@/features/org/organization.data"

type OrgAccessProps = PermissionProps & {
  permission: OrganizationPermission
}

export const OrgAccess = ({ permission, children }: OrgAccessProps) => {
  const { data, isPending, isError } = useOrgPermission(permission)

  const disabled = isPending || isError || !data?.data?.success

  return <>{children(disabled, isPending)}</>
}
