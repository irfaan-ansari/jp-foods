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
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { USER_ROLES } from "@/features/user/user.const"

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
  const { searchParamsObj, queryParams } = useRouterStuff()
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
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <FilterTab queryKey="status" tabs={OPTIONS} path="/users/count" />
          <UserRoleSelector
            selected={searchParamsObj.role || "All"}
            onChange={(value) => {
              queryParams({ set: { role: value.value } })
            }}
          >
            <Button
              variant="outline"
              className="w-40 justify-start text-muted-foreground lg:ml-auto"
            >
              <Sort />
              Role:
              <span className="truncate">
                {USER_ROLES[searchParamsObj.role || "all"]?.label}
              </span>
            </Button>
          </UserRoleSelector>
          <SearchQueryParam
            className="w-full max-w-none lg:max-w-xs"
            placeholder="Search users..."
          />
        </div>
        <UserClient />
      </PageContent>
    </React.Fragment>
  )
}

export default UsersPage
