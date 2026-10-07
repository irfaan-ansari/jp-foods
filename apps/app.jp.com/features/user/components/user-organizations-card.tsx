"use client"

import { Building, ShieldCheck, ArrowUpRight, MapPin } from "lucide-react"
import { Button } from "@jp/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@jp/ui/components/dialog"
import { MemberRoleBadge } from "@/features/org/member/components/member-client"
const DEMO_ORGANIZATION_PERMISSIONS: Record<
  string,
  Record<string, string[]>
> = {
  sales: {
    Customers: ["Read"],
    Members: ["Read"],
    Orders: ["Read", "Update"],
    Products: ["Create", "Read", "Update", "Delete", "Import", "Export"],
    "Price lists": ["Read", "Update"],
    Messaging: ["Create", "Read", "Send"],
  },
  customer: {
    Customers: ["Read", "Update"],
    Members: ["Read"],
    Invitations: ["Create", "Read", "Cancel"],
    Orders: ["Create", "Read", "Update", "Cancel"],
    Products: ["Read"],
    "Order guides": ["Create", "Read"],
  },
}

const DEMO_CUSTOMER_PERMISSIONS: Record<string, Record<string, string[]>> = {
  Member: { Orders: ["Create", "Read"], "Order guides": ["Read"] },
  Owner: {
    Orders: ["Create", "Read", "Update", "Cancel"],
    "Order guides": ["Create", "Read", "Update"],
    "Account members": ["Invite", "Remove"],
  },
}

// Preview data until user organization and team memberships are available.
const DEMO_ORGANIZATIONS = [
  {
    id: "demo-org-1",
    name: "Jimenez Produce",
    initials: "JP",
    role: "sales",
    joinedAt: "Sep 12, 2026",
    customers: [
      {
        id: "demo-customer-1",
        name: "Market Street Grocers",
        initials: "MG",
        location: "San Francisco, CA",
        role: "Member",
      },
      {
        id: "demo-customer-2",
        name: "Green Valley Kitchen",
        initials: "GK",
        location: "San Jose, CA",
        role: "Member",
      },
    ],
  },
  {
    id: "demo-org-2",
    name: "Fresh Coast Foods",
    initials: "FC",
    role: "customer",
    joinedAt: "Sep 24, 2026",
    customers: [
      {
        id: "demo-customer-3",
        name: "Coastal Market",
        initials: "CM",
        location: "Oakland, CA",
        role: "Owner",
      },
    ],
  },
]

export const UserOrganizationsCard = () => (
  <section className="space-y-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">
          Organizations & customers
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Memberships and the accounts this user can access.
        </p>
      </div>
      <span className="rounded-md bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-700 dark:text-amber-400">
        Demo data
      </span>
    </div>
    <div className="space-y-5">
      {DEMO_ORGANIZATIONS.map((organization) => (
        <article
          key={organization.id}
          className="overflow-hidden rounded-xl border bg-card"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-secondary">
                  <Building className="size-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">{organization.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Joined {organization.joinedAt}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MemberRoleBadge status={organization.role} />
              <PermissionsButton
                name={organization.name}
                scope="Organization"
                permissions={
                  DEMO_ORGANIZATION_PERMISSIONS[organization.role] ?? {}
                }
              />
            </div>
          </div>
          <div className="border-t">
            <div className="flex items-center justify-between bg-muted/30 px-5 py-2.5 text-xs text-muted-foreground">
              <span>Customer accounts</span>
              <span>{organization.customers.length}</span>
            </div>
            <div className="divide-y">
              {organization.customers.map((customer) => (
                <div
                  key={customer.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-md border text-[10px] font-semibold text-muted-foreground">
                      {customer.initials}
                    </span>
                    <div>
                      <div className="text-sm font-medium">{customer.name}</div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3" />
                        {customer.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {customer.role}
                    </span>
                    <PermissionsButton
                      name={customer.name}
                      scope="Customer"
                      permissions={
                        DEMO_CUSTOMER_PERMISSIONS[customer.role] ?? {}
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
    <p className="text-xs text-muted-foreground">
      Sample memberships and permissions. Live account data is not connected
      yet.
    </p>
  </section>
)

const PermissionsButton = ({
  name,
  scope,
  permissions,
}: {
  name: string
  scope: string
  permissions: Record<string, string[]>
}) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 text-xs text-muted-foreground"
        aria-label={`View permissions for ${name}`}
      >
        <ShieldCheck className="size-3.5" />
        Access
        <ArrowUpRight className="size-3" />
      </Button>
    </DialogTrigger>
    <DialogContent className="max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{name}</DialogTitle>
        <DialogDescription>{scope} permissions · Demo data</DialogDescription>
      </DialogHeader>
      <dl className="divide-y">
        {Object.entries(permissions).map(([resource, actions]) => (
          <div
            key={resource}
            className="grid gap-2 py-3 text-sm sm:grid-cols-[110px_1fr]"
          >
            <dt className="font-medium">{resource}</dt>
            <dd className="leading-relaxed text-muted-foreground">
              {actions.join(" · ")}
            </dd>
          </div>
        ))}
      </dl>
    </DialogContent>
  </Dialog>
)
