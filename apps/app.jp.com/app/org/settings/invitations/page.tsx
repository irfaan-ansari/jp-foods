import React from "react"
import { Plus } from "lucide-react"
import { Button } from "@jp/ui/components/button"
import { PageHeader } from "@/components/page-content"

const InvitationPage = () => {
  return (
    <React.Fragment>
      <PageHeader title="Invitations">
        <Button>
          <Plus />
          Invite Member
        </Button>
      </PageHeader>
    </React.Fragment>
  )
}

export default InvitationPage
