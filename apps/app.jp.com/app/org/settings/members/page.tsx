"use client"

import React from "react"
import { Plus } from "lucide-react"
import { Button } from "@jp/ui/components/button"
import { FilterTab } from "@/components/filter-tabs"
import { PageContent, PageHeader } from "@/components/page-content"
import { OrgAccess } from "@/features/auth/components/org-permission"
import { MemberDialog } from "@/features/org/member/components/member-dialog"
import { MemberClient } from "@/features/org/member/components/member-client"

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
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <FilterTab queryKey="role" tabs={OPTIONS} path="/org/members/count" />
          <SearchQueryParam
            className="w-full max-w-none lg:max-w-xs"
            placeholder="Search users..."
          />
        </div>
        <MemberClient />
      </PageContent>
    </React.Fragment>
  )
}

export default MembersPage
