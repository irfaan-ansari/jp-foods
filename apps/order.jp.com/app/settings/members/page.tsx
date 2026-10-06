import React from "react"
import { FilterTab } from "@/components/filter-tabs"

import { MemberClient } from "@/features/members/components"
import { SearchQueryParam } from "@jp/ui/components/jp"

import { STATUS } from "@/features/members/member.const"

const MembersPage = () => {
  return (
    <React.Fragment>
      <div className="flex items-center gap-3">
        <FilterTab
          queryKey="team-members"
          tabs={Object.values(STATUS)}
          path="/members/count"
        />

        <SearchQueryParam className="ml-auto" />
      </div>
      <MemberClient />
    </React.Fragment>
  )
}

export default MembersPage
