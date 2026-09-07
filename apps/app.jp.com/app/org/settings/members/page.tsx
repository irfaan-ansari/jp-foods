"use client"

import React from "react"
import { Plus } from "lucide-react"
import { Sort } from "@solar-icons/react"
import { Button } from "@jp/ui/components/button"
import { FilterTab } from "@/components/filter-tabs"
import { PageContent, PageHeader } from "@/components/page-content"
import { OrgAccess } from "@/features/auth/components/org-permission"
import { MemberDialog } from "@/features/org/member/components/member-dialog"
import { MemberClient } from "@/features/org/member/components/member-client"

import { MemberRoleSelector } from "@/features/org/member/components/member-role-selector"
import { SearchQueryParam } from "@jp/ui/components/jp"

const OPTIONS = [{ label: "All", value: "", color: "#A1A1AA" }]

const MembersPage = () => {
  return (
    <React.Fragment>
      <PageHeader title="Members">
        <OrgAccess permission={{ member: ["create"] }}>
          {(disabled) => (
            <MemberDialog>
              <Button disabled={disabled}>
                <Plus />
                Add New
              </Button>
            </MemberDialog>
          )}
        </OrgAccess>
      </PageHeader>

      <PageContent className="space-y-3 lg:space-y-6">
        <div className="flex items-center justify-start gap-3">
          <FilterTab
            queryKey="role"
            tabs={OPTIONS}
            path="/api/v1/org/members/count"
          />
          <MemberRoleSelector>
            <Button
              variant="outline"
              className="ml-auto min-w-28 justify-start text-muted-foreground"
            >
              <Sort />
              Role: All
            </Button>
          </MemberRoleSelector>
          <SearchQueryParam />
        </div>
        <MemberClient />
      </PageContent>
    </React.Fragment>
  )
}

export default MembersPage
