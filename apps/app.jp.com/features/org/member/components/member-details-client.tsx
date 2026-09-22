"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@jp/ui/components/card"
import { CopyButton } from "@jp/ui/components/jp"
import { Avatar, AvatarFallback, AvatarImage } from "@jp/ui/components/avatar"
import { formatDate, formatPhone } from "@jp/utils"
import { Calendar, Letter, Smartphone, User } from "@solar-icons/react"
import type { Member } from "../member.type"
import { MemberDropdown } from "./member-dropdown"
import { MemberRoleBadge } from "./member-card"

const MEMBER_ROLE_PERMISSIONS: Record<string, Record<string, string[]>> = {
  owner: {
    Organization: ["Update", "Delete"],
    Members: ["Create", "Read", "Update", "Delete"],
    Teams: ["Create", "Read", "Update", "Delete"],
    Orders: ["Create", "Read", "Update", "Cancel", "Delete"],
    Products: ["Create", "Read", "Update", "Delete", "Import", "Export"],
    Settings: ["Price lists", "Price levels", "Tax rules", "Order guides"],
    Promotions: ["Create", "Read", "Update", "Delete"],
    Messaging: ["Create", "Read", "Send", "Delete"],
  },
  manager: {
    Organization: ["Update"],
    Members: ["Create", "Read", "Update", "Delete"],
    Teams: ["Create", "Read", "Update", "Delete"],
    Orders: ["Read", "Update"],
    Products: ["Create", "Read", "Update", "Delete", "Import", "Export"],
    Settings: ["Price lists", "Price levels", "Tax rules", "Order guides"],
    Promotions: ["Create", "Read", "Update"],
    Messaging: ["Create", "Read", "Send"],
  },
  sales: {
    Members: ["Read"],
    Teams: ["Read"],
    Orders: ["Read", "Update"],
    Products: ["Create", "Read", "Update", "Delete", "Import", "Export"],
    Settings: ["Price lists", "Price levels", "Tax rules", "Order guides"],
    Messaging: ["Create", "Read", "Send"],
  },
  customer: {
    Members: ["Read"],
    Teams: ["Read", "Update"],
    Invitations: ["Create", "Read"],
    Products: ["Read"],
    Orders: ["Create", "Read", "Update", "Cancel"],
    "Order Guides": ["Read"],
  },
}

export const MemberDetailsClient = ({ data }: { data: Member }) => {
  return (
    <div className="grid grid-cols-1 gap-6 @5xl:grid-cols-3">
      <div className="space-y-6 @5xl:col-span-2">
        <Card size="sm">
          <CardHeader className="border-b border-dashed">
            <div className="flex items-center gap-3">
              <Avatar size="lg">
                <AvatarImage src={data.user?.image ?? ""} alt="" />
                <AvatarFallback>
                  <User className="size-4" />
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <CardTitle>{data.user?.name}</CardTitle>
                <div>
                  <MemberRoleBadge status={data.role} />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <div className="grid gap-1">
              <div className="text-xs text-muted-foreground">Email</div>
              <CopyButton
                prefix={<Letter className="size-4" />}
                value={data.user?.email}
                className="*:data-[slot=copy-value]:text-foreground"
              />
            </div>
            <div className="grid gap-1">
              <div className="text-xs text-muted-foreground">Phone</div>
              <CopyButton
                prefix={<Smartphone className="size-4" />}
                value={
                  data.user?.phoneNumber ? formatPhone(data.user.phoneNumber) : "—"
                }
                className="*:data-[slot=copy-value]:text-foreground"
              />
            </div>
            <Detail label="Member ID" value={data.id} />
            <Detail label="User ID" value={data.userId} />
            <Detail label="Email Verified" value={data.user?.emailVerified ? "Yes" : "No"} />
            <Detail
              label="Phone Verified"
              value={data.user?.phoneNumberVerified ? "Yes" : "No"}
            />
          </CardContent>
        </Card>

        {data.accounts.length > 0 && (
          <Card size="sm">
            <CardHeader className="border-b border-dashed">
              <CardTitle>Customer Accounts</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {data.accounts.map((account) => (
                <div key={account.id} className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={account.logo ?? ""} alt="" />
                    <AvatarFallback>
                      <User className="size-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid">
                    <div className="font-medium">{account.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {account.id}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <PermissionsCard
          title="Permissions"
          permissions={MEMBER_ROLE_PERMISSIONS[data.role] ?? {}}
        />
      </div>

      <div>
        <div className="sticky top-20 space-y-6">
          <Card size="sm">
            <CardHeader className="border-b border-dashed">
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <MemberDropdown data={data} />
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
              <Detail label="Joined At" value={formatDate(data.createdAt)} />
              <Detail label="Organization ID" value={data.organizationId} />
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
