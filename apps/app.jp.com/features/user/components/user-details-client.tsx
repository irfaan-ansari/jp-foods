"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@jp/ui/components/card"
import { CopyButton } from "@jp/ui/components/jp"
import { Avatar, AvatarFallback, AvatarImage } from "@jp/ui/components/avatar"
import { formatDate, formatPhone } from "@jp/utils"
import { Calendar, Letter, Smartphone, User as UserIcon } from "@solar-icons/react"
import type { User } from "../user.type"
import { UserDropdown } from "./user-dropdown"
import { UserRoleBadge, UserStatusBadge } from "./user-card"

const USER_ROLE_PERMISSIONS: Record<string, Record<string, string[]>> = {
  superAdmin: {
    Portal: ["Organization", "CRM"],
    Users: ["Create", "List", "Get", "Update", "Delete", "Ban", "Set role"],
    Sessions: ["List", "Revoke"],
    CRM: ["Manage customers", "Manage candidates", "Manage catalog inquiries"],
  },
  developer: {
    Portal: ["Organization", "CRM"],
    Users: ["Create", "List", "Get", "Update", "Delete", "Ban", "Set role"],
    Sessions: ["List", "Revoke"],
    CRM: ["Manage customers", "Manage candidates", "Manage catalog inquiries"],
  },
  admin: {
    Portal: ["Organization", "CRM"],
    Users: ["Create", "List", "Impersonate", "Set password", "Set email", "Set role", "Get", "Ban", "Update"],
    Sessions: ["List", "Revoke"],
    CRM: ["Create/read customer and candidate invites", "Read/update applications", "Read/update catalog inquiries"],
  },
  reviewer: {
    Portal: ["CRM"],
    Users: ["List", "Set email"],
    CRM: ["Create/read invites", "Read/update applications", "Read/update catalog inquiries"],
  },
  user: {
    Portal: ["Organization"],
    Users: ["List"],
  },
  customer: {
    Portal: ["Customer"],
  },
}

export const UserDetailsClient = ({ data }: { data: User }) => {
  const role = data.role ?? "user"

  return (
    <div className="grid grid-cols-1 gap-6 @5xl:grid-cols-3">
      <div className="space-y-6 @5xl:col-span-2">
        <Card size="sm">
          <CardHeader className="border-b border-dashed">
            <div className="flex items-center gap-3">
              <Avatar size="lg">
                <AvatarImage src={data.image ?? ""} alt="" />
                <AvatarFallback>
                  <UserIcon className="size-4" />
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <CardTitle>{data.name}</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <UserRoleBadge status={role} />
                  <UserStatusBadge status={data.banned ? "banned" : "active"} />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <div className="grid gap-1">
              <div className="text-xs text-muted-foreground">Email</div>
              <CopyButton
                prefix={<Letter className="size-4" />}
                value={data.email}
                className="*:data-[slot=copy-value]:text-foreground"
              />
            </div>
            <div className="grid gap-1">
              <div className="text-xs text-muted-foreground">Phone</div>
              <CopyButton
                prefix={<Smartphone className="size-4" />}
                value={data.phoneNumber ? formatPhone(data.phoneNumber) : "—"}
                className="*:data-[slot=copy-value]:text-foreground"
              />
            </div>
            <Detail label="Email Verified" value={data.emailVerified ? "Yes" : "No"} />
            <Detail
              label="Phone Verified"
              value={data.phoneNumberVerified ? "Yes" : "No"}
            />
            <Detail label="Country Code" value={data.countryCode} />
            <Detail label="User ID" value={data.id} />
            {data.banned && (
              <>
                <Detail label="Ban Reason" value={data.banReason || "—"} />
                <Detail
                  label="Ban Expires"
                  value={data.banExpires ? formatDate(data.banExpires) : "Never"}
                />
              </>
            )}
          </CardContent>
        </Card>

        <PermissionsCard
          title="Permissions"
          permissions={USER_ROLE_PERMISSIONS[role] ?? {}}
        />
      </div>

      <div>
        <div className="sticky top-20 space-y-6">
          <Card size="sm">
            <CardHeader className="border-b border-dashed">
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <UserDropdown data={data} />
            </CardContent>
          </Card>

          <Card size="sm" className="bg-secondary/40">
            <CardHeader className="border-b border-dashed">
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Detail
                label="Last Active"
                value={data.lastSession ? formatDate(data.lastSession) : "Never"}
                icon={<Calendar className="size-4" />}
              />
              <Detail label="Created At" value={formatDate(data.createdAt)} />
              <Detail label="Updated At" value={formatDate(data.updatedAt)} />
              <Detail
                label="Default Organization"
                value={data.defaultOrganizationId || "—"}
              />
              <Detail label="Default Team" value={data.defaultTeamId || "—"} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

const Detail = ({
  label,
  value,
  icon,
}: {
  label: string
  value: React.ReactNode
  icon?: React.ReactNode
}) => (
  <div className="grid gap-1">
    <div className="text-xs text-muted-foreground">{label}</div>
    <div className="flex items-center gap-1 break-all">
      {icon}
      {value}
    </div>
  </div>
)

const PermissionsCard = ({
  title,
  permissions,
}: {
  title: string
  permissions: Record<string, string[]>
}) => (
  <Card size="sm">
    <CardHeader className="border-b border-dashed">
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className="grid gap-4 md:grid-cols-2">
      {Object.entries(permissions).length ? (
        Object.entries(permissions).map(([resource, actions]) => (
          <div key={resource} className="grid gap-2">
            <div className="font-medium">{resource}</div>
            <div className="flex flex-wrap gap-2">
              {actions.map((action) => (
                <span
                  key={action}
                  className="rounded-md bg-secondary px-2 py-1 text-xs text-muted-foreground"
                >
                  {action}
                </span>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-sm text-muted-foreground">
          No permissions configured for this role.
        </div>
      )}
    </CardContent>
  </Card>
)
