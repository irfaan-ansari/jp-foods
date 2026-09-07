"use client"

import React from "react"
import { Plus } from "lucide-react"
import { Sort } from "@solar-icons/react"
import { Button } from "@jp/ui/components/button"
import { FilterTab } from "@/components/filter-tabs"
import { PageContent, PageHeader } from "@/components/page-content"
import { UserClient } from "@/features/user/components/user-client"
import { UserRoleSelector } from "@/features/user/components/user-role-selector"
import { UserDialog } from "@/features/user/components/user-dialog"
import { UserAccess } from "@/features/auth/components/user-permission"
import { SearchQueryParam } from "@jp/ui/components/jp/search-input"

const OPTIONS = [
  { label: "All", value: "", color: "#A1A1AA" },
  {
    label: "Active",
    value: "active",
    color: "#22C55E",
  },
  {
    label: "Banned",
    value: "banned",
    color: "#F59E0B",
  },
]

const UsersPage = () => {
  return (
    <React.Fragment>
      <PageHeader title="Users">
        <UserAccess permission={{ user: ["create"] }}>
          {(disabled, isPending) => (
            <UserDialog>
              <Button
                disabled={disabled}
                className={isPending ? "animate-pulse" : ""}
              >
                <Plus />
                Add New
              </Button>
            </UserDialog>
          )}
        </UserAccess>
      </PageHeader>

      <PageContent className="space-y-3 lg:space-y-6">
        <div className="flex items-center justify-start gap-3">
          <FilterTab queryKey="role" tabs={OPTIONS} path="/users/count" />
          <UserRoleSelector>
            <Button
              variant="outline"
              className="ml-auto min-w-28 justify-start text-muted-foreground"
            >
              <Sort />
              Role: All
            </Button>
          </UserRoleSelector>
          <SearchQueryParam />
        </div>
        <UserClient />
      </PageContent>
    </React.Fragment>
  )
}

export default UsersPage
