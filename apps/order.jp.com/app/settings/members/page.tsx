import React from "react"
import { FilterTab } from "@/components/filter-tabs"

import { Plus } from "lucide-react"
import { Button } from "@jp/ui/components/button"
import { MemberClient } from "@/features/members/components"
import { SearchQueryParam } from "@jp/ui/components/jp"
import { InvitationDialog } from "@/features/invitations/components/invitation-dialog"

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
        <InvitationDialog>
          <Button>
            <Plus /> Invite Member
          </Button>
        </InvitationDialog>
      </div>
      <MemberClient />
    </React.Fragment>
  )
}

export default MembersPage
