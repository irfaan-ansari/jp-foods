"use client"

import React from "react"
import { ChevronDown, Plus, X } from "lucide-react"
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
import { STATUS, USER_ROLES } from "@/features/user/user.const"

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
          <FilterTab
            queryKey="status"
            tabs={Object.values(STATUS)}
            path="/users/count"
          />
          <UserRoleSelector
            selected={searchParamsObj.role || "All"}
            onChange={(value) => {
              queryParams({ set: { role: value.value }, del: "q" })
            }}
          >
            <Button
              variant="outline"
              className="w-40 justify-start text-muted-foreground lg:ml-auto"
            >
              <Sort />
              Role:
              <span className="truncate">
                {USER_ROLES[searchParamsObj.role!]?.label ?? "All"}
              </span>
              {searchParamsObj.role ? (
                <span
                  onClick={(e) => {
                    e.preventDefault()
                    queryParams({ del: "role" })
                  }}
                  className="ml-auto hover:text-destructive"
                >
                  <X />
                </span>
              ) : (
                <ChevronDown className="ml-auto" />
              )}
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
